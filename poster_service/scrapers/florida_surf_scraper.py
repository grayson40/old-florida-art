"""
Florida Surf Break Scraper
Extracts surf break data from surf-forecast.com for AI poster generation
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin
import logging
from typing import List, Dict, Optional

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FloridaSurfScraper:
    def __init__(self):
        self.base_url = "https://www.surf-forecast.com"
        self.session = requests.Session()
        # Set headers to mimic a real browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
        })
        self.surf_breaks = []
    
    def extract_links_from_html_file(self, file_path: str) -> List[str]:
        """
        Extract all surf break links from the HTML file

        Args:
            file_path (str): The path to the HTML file containing the surf break links

        Returns:
            List[str]: A list of unique surf break links
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # Find all links that start with /breaks/
            break_links = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                if href.startswith('/breaks/'):
                    full_url = urljoin(self.base_url, href)
                    break_links.append(full_url)
            
            # Remove duplicates while preserving order
            unique_links = list(dict.fromkeys(break_links))
            logger.info(f"Found {len(unique_links)} unique surf break links")
            return unique_links
            
        except Exception as e:
            logger.error(f"Error reading HTML file: {e}")
            return []
    
    def extract_break_info(self, url: str, break_name: str) -> Optional[Dict]:
        """
        Extract break information from individual break page

        Args:
            url (str): The URL of the individual break page
            break_name (str): The name of the surf break
        """
        try:
            logger.info(f"Scraping: {break_name}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            break_info = {
                'name': break_name,
                'url': url,
                'latitude': None,
                'longitude': None,
                'break_type': None,
                'region': None,
                'description': None
            }
            
            # Extract region from the h2 element (e.g., "(Gulf Coast, Florida, USA)")
            h2_region = soup.find('h2', class_='h1add tab')
            if h2_region:
                region_text = h2_region.get_text().strip()
                # Remove parentheses and extract just the Florida region part
                region_text = region_text.replace('(', '').replace(')', '').replace(', USA', '')
                break_info['region'] = region_text
                logger.info(f"Found region: {region_text}")
            
            # Extract break type from the spot info table
            info_table = soup.find('table', class_='guide-header__information')
            if info_table:
                # Look for the cell that contains break type (usually has an icon and text)
                type_cells = info_table.find_all('td')
                for cell in type_cells:
                    # Check if this cell contains a break type icon
                    type_icon = cell.find('img', class_=re.compile(r'guide-header__type-icon.*break'))
                    if type_icon:
                        # Extract text after the img tag
                        break_type_text = cell.get_text().strip()
                        if break_type_text:
                            break_info['break_type'] = break_type_text
                            logger.info(f"Found break type: {break_type_text}")
                            break
            
            # Extract description from the guide summary
            summary_div = soup.find('div', class_='guide-header__summary__text')
            if summary_div:
                desc_p = summary_div.find('p')
                if desc_p:
                    break_info['description'] = desc_p.get_text().strip()[:500]  # Limit description length
                    logger.info(f"Found description: {break_info['description'][:50]}...")
            
            # Try to extract coordinates from map data or script tags
            # Look for leaflet map data or JavaScript with coordinates
            scripts = soup.find_all('script')
            for script in scripts:
                if script.string:
                    # Look for various coordinate patterns in JavaScript
                    patterns = [
                        r'lat[itude]*["\']?\s*[:=]\s*["\']?([-+]?\d+\.?\d*)',
                        r'l(ng|on)[itude]*["\']?\s*[:=]\s*["\']?([-+]?\d+\.?\d*)',
                        r'center["\']?\s*:\s*\[\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*\]',
                        r'latlng["\']?\s*:\s*\[\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*\]'
                    ]
                    
                    # Try to find latitude
                    if not break_info['latitude']:
                        lat_match = re.search(patterns[0], script.string, re.IGNORECASE)
                        if lat_match:
                            try:
                                potential_lat = float(lat_match.group(1))
                                # Validate that it's a reasonable latitude for Florida (24-31 degrees N)
                                if 24 <= potential_lat <= 31:
                                    break_info['latitude'] = potential_lat
                            except (ValueError, IndexError):
                                continue
                    
                    # Try to find longitude
                    if not break_info['longitude']:
                        lng_match = re.search(patterns[1], script.string, re.IGNORECASE)
                        if lng_match:
                            try:
                                potential_lng = float(lng_match.group(2))
                                # Validate that it's a reasonable longitude for Florida (-87 to -80 degrees W)
                                if -87 <= potential_lng <= -80:
                                    break_info['longitude'] = potential_lng
                            except (ValueError, IndexError):
                                continue
                    
                    # Try to find center coordinates as array
                    if not break_info['latitude'] or not break_info['longitude']:
                        center_match = re.search(patterns[2], script.string, re.IGNORECASE)
                        if center_match:
                            try:
                                lat = float(center_match.group(1))
                                lng = float(center_match.group(2))
                                # Validate coordinates for Florida
                                if 24 <= lat <= 31 and -87 <= lng <= -80:
                                    break_info['latitude'] = lat
                                    break_info['longitude'] = lng
                            except (ValueError, IndexError):
                                continue
            
            # Look for Google Maps links as backup
            if not break_info['latitude'] or not break_info['longitude']:
                map_links = soup.find_all('a', href=re.compile(r'maps\.google|google\.com/maps'))
                for link in map_links:
                    href = link.get('href', '')
                    # Extract coordinates from Google Maps URL
                    coord_match = re.search(r'([-+]?\d+\.?\d*),([-+]?\d+\.?\d*)', href)
                    if coord_match:
                        try:
                            lat = float(coord_match.group(1))
                            lng = float(coord_match.group(2))
                            # Validate coordinates for Florida
                            if 24 <= lat <= 31 and -87 <= lng <= -80:
                                break_info['latitude'] = lat
                                break_info['longitude'] = lng
                                logger.info(f"Found coordinates from Google Maps: {lat}, {lng}")
                                break
                        except (ValueError, IndexError):
                            continue
            
            # If we still couldn't find break type, try to infer from name or description
            if not break_info['break_type']:
                name_lower = break_name.lower()
                desc_lower = (break_info.get('description') or '').lower()
                
                if 'pier' in name_lower or 'pier' in desc_lower:
                    break_info['break_type'] = 'Pier'
                elif 'jetty' in name_lower or 'jetty' in desc_lower:
                    break_info['break_type'] = 'Jetty'
                elif 'inlet' in name_lower or 'inlet' in desc_lower:
                    break_info['break_type'] = 'Inlet'
                elif 'reef' in name_lower or 'reef break' in desc_lower:
                    break_info['break_type'] = 'Reef'
                elif 'point' in name_lower or 'point break' in desc_lower:
                    break_info['break_type'] = 'Point Break'
                elif 'sandbar' in desc_lower:
                    break_info['break_type'] = 'Sandbar'
                elif 'beach' in name_lower or 'beach break' in desc_lower:
                    break_info['break_type'] = 'Beach Break'
                else:
                    break_info['break_type'] = 'Beach Break'  # Default assumption
            
            # Clean up the break name
            if break_info['name']:
                break_info['name'] = break_info['name'].replace('-', ' ').replace('_', ' ').title()
            
            logger.info(f"Extracted: {break_info['name']} ({break_info['break_type']}) in {break_info['region']}")
            
            return break_info
            
        except requests.RequestException as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
        except Exception as e:
            logger.error(f"Error parsing {url}: {e}")
            return None
    
    def scrape_all_breaks(self, html_file_path: str, max_breaks: Optional[int] = None) -> List[Dict]:
        """
        Scrape all surf breaks from the HTML file

        Args:
            html_file_path (str): The path to the HTML file containing the surf break links
            max_breaks (Optional[int]): The maximum number of breaks to scrape (for testing)

        Returns:
            List[Dict]: A list of dictionaries containing the surf break information
        """
        # Extract links from HTML file
        break_urls = self.extract_links_from_html_file(html_file_path)
        
        if not break_urls:
            logger.error("No break URLs found")
            return []
        
        # Limit the number of breaks for testing if specified
        if max_breaks:
            break_urls = break_urls[:max_breaks]
            logger.info(f"Limited to first {max_breaks} breaks for testing")
        
        scraped_breaks = []
        
        for i, url in enumerate(break_urls, 1):
            # Extract break name from URL
            break_name = url.split('/')[-1].replace('-', ' ').replace('_', ' ')
            
            # Scrape the individual break page
            break_info = self.extract_break_info(url, break_name)
            
            if break_info:
                scraped_breaks.append(break_info)
                logger.info(f"✓ Scraped {i}/{len(break_urls)}: {break_name}")
            else:
                logger.warning(f"✗ Failed to scrape {i}/{len(break_urls)}: {break_name}")
            
            # Be polite - add delay between requests
            time.sleep(1)  # 1 second delay between requests
        
        return scraped_breaks
    
    def save_to_json(self, data: List[Dict], filename: str = 'florida_surf_breaks.json'):
        """
        Save scraped data to JSON file

        Args:
            data (List[Dict]): A list of dictionaries containing the surf break information
            filename (str): The name of the file to save the data to
        """
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved {len(data)} surf breaks to {filename}")
        except Exception as e:
            logger.error(f"Error saving to JSON: {e}")
    
    def save_to_csv(self, data: List[Dict], filename: str = 'florida_surf_breaks.csv'):
        """
        Save scraped data to CSV file

        Args:
            data (List[Dict]): A list of dictionaries containing the surf break information
            filename (str): The name of the file to save the data to
        """
        try:
            import csv
            
            if not data:
                logger.warning("No data to save to CSV")
                return
            
            fieldnames = ['name', 'latitude', 'longitude', 'break_type', 'region', 'url', 'description']
            
            with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                
                for break_data in data:
                    # Only include the specified fields
                    row = {field: break_data.get(field, '') for field in fieldnames}
                    writer.writerow(row)
            
            logger.info(f"Saved {len(data)} surf breaks to {filename}")
        except Exception as e:
            logger.error(f"Error saving to CSV: {e}")


def main():
    """
    Main function to run the scraper
    """
    scraper = FloridaSurfScraper()
    
    # Check robots.txt first (as recommended in the business plan)
    logger.info("Checking robots.txt...")
    try:
        robots_response = scraper.session.get('https://www.surf-forecast.com/robots.txt')
        logger.info("robots.txt content:")
        print(robots_response.text[:500])  # Show first 500 characters
    except Exception as e:
        logger.warning(f"Could not fetch robots.txt: {e}")
    
    # Start with a small test first
    logger.info("Starting with a test of 5 breaks...")
    test_breaks = scraper.scrape_all_breaks('listings.html', max_breaks=5)
    
    if test_breaks:
        # Save test results
        scraper.save_to_json(test_breaks, 'florida_surf_breaks_test.json')
        scraper.save_to_csv(test_breaks, 'florida_surf_breaks_test.csv')
        
        # Show a sample of the results
        logger.info("Sample results:")
        for break_info in test_breaks[:2]:
            print(f"Name: {break_info['name']}")
            print(f"Type: {break_info['break_type']}")
            print(f"Coordinates: {break_info['latitude']}, {break_info['longitude']}")
            print(f"Region: {break_info['region']}")
            print("-" * 50)
        
        # Ask if user wants to continue with full scraping
        user_input = input("\nTest successful! Do you want to scrape all breaks? (y/n): ").lower().strip()
        
        if user_input == 'y':
            logger.info("Starting full scraping...")
            all_breaks = scraper.scrape_all_breaks('listings.html')
            
            if all_breaks:
                scraper.save_to_json(all_breaks, 'florida_surf_breaks_full.json')
                scraper.save_to_csv(all_breaks, 'florida_surf_breaks_full.csv')
                logger.info(f"Successfully scraped {len(all_breaks)} surf breaks!")
        else:
            logger.info("Scraping stopped by user.")
    else:
        logger.error("Test scraping failed. Please check the issues above.")


if __name__ == "__main__":
    main() 