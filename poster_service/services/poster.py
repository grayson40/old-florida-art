#!/usr/bin/env python3
"""
Florida Surf Break Poster Generator Service

Service for generating stylized posters of Florida surf breaks
with customizable visual styles and professional typography.
"""

import json
import math
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from enum import Enum

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class PosterStyle(Enum):
    """Available poster styles for surf break maps"""
    CLASSIC = "classic"
    VINTAGE = "vintage"
    MINIMALIST = "minimalist"
    WATERCOLOR = "watercolor"
    RETRO = "retro"


@dataclass
class SurfBreak:
    """Data class representing a surf break location"""
    name: str
    latitude: float
    longitude: float
    break_type: str
    
    def __post_init__(self):
        """Validate surf break data"""
        if not (-90 <= self.latitude <= 90):
            raise ValueError(f"Invalid latitude: {self.latitude}")
        if not (-180 <= self.longitude <= 180):
            raise ValueError(f"Invalid longitude: {self.longitude}")


@dataclass
class MapBounds:
    """Geographic bounds for the map"""
    min_lat: float
    max_lat: float
    min_lon: float
    max_lon: float


@dataclass
class StyleConfig:
    """Configuration for a specific poster style"""
    name: str
    colors: Dict[str, Tuple[int, int, int, int]]  # RGBA colors
    fonts: Dict[str, str]  # Font family names
    font_sizes: Dict[str, int]
    marker_style: str
    line_style: Dict[str, Any]
    background_effects: List[str]
    text_effects: List[str]


class FloridaSurfBreakPosterService:
    """
    Production service for generating stylized Florida surf break posters.
    
    This service provides a clean API for creating professional-quality
    surf break maps with various artistic styles.
    """
    
    # Default Florida map bounds
    DEFAULT_BOUNDS = MapBounds(
        min_lat=24.5,   # Key West area
        max_lat=31.0,   # Northern Florida
        min_lon=-87.6,  # Western Panhandle
        max_lon=-79.9   # Eastern coast
    )
    
    # Break type color mappings
    BREAK_TYPE_COLORS = {
        'Beach': (255, 107, 107, 255),        # Coral red
        'Beach/pier': (74, 144, 226, 255),    # Ocean blue
        'Beach/jetty': (72, 187, 120, 255),   # Sea green
        'Reef': (255, 159, 67, 255),          # Sunset orange
        'Point': (162, 89, 255, 255),         # Purple
        'Sandbar': (255, 206, 84, 255),       # Sandy yellow
        'Breakwater': (128, 142, 155, 255),   # Steel gray
        'River': (85, 239, 196, 255),         # Turquoise
        'Beach and reef': (255, 177, 66, 255), # Light orange
        'Beach/pier/jetty': (34, 166, 179, 255), # Teal
        'Beach, reef and jetty': (255, 118, 117, 255), # Pink coral
    }
    
    def __init__(self, data_path: str = 'scrapers/data/florida_surf_breaks_full.json'):
        """
        Initialize the poster service.
        
        Args:
            data_path: Path to the surf break JSON data file
        """
        self.data_path = Path(data_path)
        self.surf_breaks: List[SurfBreak] = []
        self.style_configs = self._load_style_configs()
        
        # Load surf break data
        self._load_surf_breaks()
    
    def _load_surf_breaks(self) -> None:
        """Load and validate surf break data from JSON file"""
        try:
            with open(self.data_path, 'r') as file:
                raw_data = json.load(file)
            
            valid_breaks = []
            for break_data in raw_data:
                try:
                    if (break_data.get('latitude') is not None and 
                        break_data.get('longitude') is not None):
                        
                        surf_break = SurfBreak(
                            name=break_data['name'],
                            latitude=float(break_data['latitude']),
                            longitude=float(break_data['longitude']),
                            break_type=break_data.get('break_type', 'Unknown')
                        )
                        valid_breaks.append(surf_break)
                        
                except (ValueError, KeyError) as e:
                    logger.warning(f"Skipping invalid break data: {e}")
                    continue
            
            self.surf_breaks = valid_breaks
            logger.info(f"Loaded {len(self.surf_breaks)} valid surf breaks")
            
        except FileNotFoundError:
            logger.error(f"Surf break data file not found: {self.data_path}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in data file: {e}")
            raise
    
    def _load_style_configs(self) -> Dict[PosterStyle, StyleConfig]:
        """Load style configurations for different poster types"""
        return {
            PosterStyle.CLASSIC: StyleConfig(
                name="Classic",
                colors={
                    'background': (245, 245, 245, 255),  # Light gray
                    'text': (45, 45, 45, 255),          # Dark gray
                    'accent': (41, 128, 185, 255),      # Professional blue
                    'legend_bg': (255, 255, 255, 230),  # Semi-transparent white
                },
                fonts={
                    'title': 'Helvetica-Bold',
                    'name': 'Helvetica',
                    'type': 'Helvetica-Light'
                },
                font_sizes={
                    'title': 24,
                    'name': 14,
                    'type': 11
                },
                marker_style='circle',
                line_style={'width': 2, 'style': 'solid'},
                background_effects=['subtle_texture'],
                text_effects=['shadow']
            ),
            
            PosterStyle.VINTAGE: StyleConfig(
                name="Vintage",
                colors={
                    'background': (240, 235, 220, 255),  # Aged paper
                    'text': (101, 67, 33, 255),         # Brown
                    'accent': (139, 69, 19, 255),       # Saddle brown
                    'legend_bg': (250, 245, 235, 200),  # Cream
                },
                fonts={
                    'title': 'Times-Bold',
                    'name': 'Times-Roman',
                    'type': 'Times-Italic'
                },
                font_sizes={
                    'title': 26,
                    'name': 15,
                    'type': 12
                },
                marker_style='star',
                line_style={'width': 3, 'style': 'dashed'},
                background_effects=['sepia', 'noise'],
                text_effects=['emboss']
            ),
            
            PosterStyle.MINIMALIST: StyleConfig(
                name="Minimalist",
                colors={
                    'background': (255, 255, 255, 255),  # Pure white
                    'text': (0, 0, 0, 255),             # Pure black
                    'accent': (100, 100, 100, 255),     # Gray
                    'legend_bg': (250, 250, 250, 255),  # Off-white
                },
                fonts={
                    'title': 'Helvetica-UltraLight',
                    'name': 'Helvetica-Light',
                    'type': 'Helvetica-UltraLight'
                },
                font_sizes={
                    'title': 20,
                    'name': 12,
                    'type': 10
                },
                marker_style='dot',
                line_style={'width': 1, 'style': 'solid'},
                background_effects=[],
                text_effects=[]
            )
        }
    
    def _get_font(self, style_config: StyleConfig, font_type: str) -> ImageFont.ImageFont:
        """Load font with fallback options"""
        size = style_config.font_sizes[font_type]
        
        # Font fallback hierarchy
        font_paths = [
            # macOS fonts
            f"/System/Library/Fonts/{style_config.fonts[font_type]}.ttc",
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/Arial.ttf",
            # Windows fonts
            "arial.ttf",
            "calibri.ttf",
            # Linux fonts
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
        ]
        
        for font_path in font_paths:
            try:
                return ImageFont.truetype(font_path, size)
            except (IOError, OSError):
                continue
        
        logger.warning(f"Could not load specified font, using default")
        return ImageFont.load_default()
    
    def _lat_lon_to_pixel(self, lat: float, lon: float, 
                         img_width: int, img_height: int, 
                         bounds: MapBounds) -> Tuple[int, int]:
        """Convert geographic coordinates to pixel coordinates"""
        x_pixel = img_width * (lon - bounds.min_lon) / (bounds.max_lon - bounds.min_lon)
        y_pixel = img_height * (bounds.max_lat - lat) / (bounds.max_lat - bounds.min_lat)
        return int(x_pixel), int(y_pixel)
    
    def _calculate_label_position(self, x: int, y: int, img_width: int, 
                                img_height: int, bounds: MapBounds) -> Tuple[int, int, str]:
        """Calculate optimal label position based on geography"""
        # Convert back to lat/lon to determine coast proximity
        lon = bounds.min_lon + (x / img_width) * (bounds.max_lon - bounds.min_lon)
        lat = bounds.max_lat - (y / img_height) * (bounds.max_lat - bounds.min_lat)
        
        # Determine label direction based on location
        distance_to_atlantic = abs(lon - bounds.max_lon)
        distance_to_gulf = abs(lon - bounds.min_lon)
        
        if lat < 26.0:  # Southern Florida
            direction = 'south'
            label_x, label_y = x, y + 30
        elif distance_to_atlantic < distance_to_gulf:  # Atlantic side
            direction = 'east'
            label_x, label_y = x + 40, y
        else:  # Gulf side
            direction = 'west'
            label_x, label_y = x - 40, y
        
        # Ensure label stays within image bounds
        label_x = max(10, min(img_width - 200, label_x))
        label_y = max(10, min(img_height - 50, label_y))
        
        return label_x, label_y, direction
    
    def _draw_enhanced_marker(self, draw: ImageDraw.Draw, x: int, y: int, 
                            break_type: str, style_config: StyleConfig) -> None:
        """Draw enhanced marker based on style configuration"""
        color = self.BREAK_TYPE_COLORS.get(break_type, (255, 0, 0, 255))
        
        if style_config.marker_style == 'circle':
            # Draw circle with border
            draw.ellipse(
                (x - 6, y - 6, x + 6, y + 6),
                fill=color,
                outline=(0, 0, 0, 255),
                width=2
            )
        elif style_config.marker_style == 'star':
            # Draw star shape (simplified as diamond for now)
            points = [(x, y-8), (x+6, y), (x, y+8), (x-6, y)]
            draw.polygon(points, fill=color, outline=(0, 0, 0, 255))
        else:  # dot
            draw.ellipse(
                (x - 3, y - 3, x + 3, y + 3),
                fill=color
            )
    
    def _draw_connection_line(self, draw: ImageDraw.Draw, start_x: int, start_y: int,
                            end_x: int, end_y: int, break_type: str, 
                            style_config: StyleConfig) -> None:
        """Draw connection line from marker to label"""
        color = self.BREAK_TYPE_COLORS.get(break_type, (255, 0, 0, 255))
        width = style_config.line_style['width']
        
        if style_config.line_style['style'] == 'dashed':
            # Draw dashed line (simplified)
            dash_length = 5
            line_length = math.sqrt((end_x - start_x)**2 + (end_y - start_y)**2)
            num_dashes = int(line_length / (dash_length * 2))
            
            for i in range(num_dashes):
                t1 = (i * 2) / (num_dashes * 2)
                t2 = (i * 2 + 1) / (num_dashes * 2)
                
                x1 = start_x + (end_x - start_x) * t1
                y1 = start_y + (end_y - start_y) * t1
                x2 = start_x + (end_x - start_x) * t2
                y2 = start_y + (end_y - start_y) * t2
                
                draw.line([(x1, y1), (x2, y2)], fill=color, width=width)
        else:
            draw.line([(start_x, start_y), (end_x, end_y)], fill=color, width=width)
    
    def _draw_enhanced_text(self, draw: ImageDraw.Draw, x: int, y: int, 
                          text: str, font: ImageFont.ImageFont, 
                          style_config: StyleConfig, text_type: str = 'name') -> Tuple[int, int]:
        """Draw text with enhanced styling"""
        text_color = style_config.colors['text']
        
        # Calculate text dimensions
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Draw background if needed
        if 'shadow' in style_config.text_effects:
            # Draw shadow
            shadow_offset = 2
            draw.text((x + shadow_offset, y + shadow_offset), text, 
                     fill=(0, 0, 0, 100), font=font)
        
        # Draw background rectangle for readability
        padding = 3
        bg_color = style_config.colors['legend_bg']
        draw.rectangle(
            (x - padding, y - padding, 
             x + text_width + padding, y + text_height + padding),
            fill=bg_color
        )
        
        # Draw main text
        draw.text((x, y), text, fill=text_color, font=font)
        
        return text_width, text_height
    
    def _create_legend(self, image: Image.Image, style_config: StyleConfig) -> Image.Image:
        """Create an enhanced legend for the poster"""
        # Get fonts
        title_font = self._get_font(style_config, 'title')
        type_font = self._get_font(style_config, 'type')
        
        # Work with a copy of the original image
        final_image = image.copy()
        draw = ImageDraw.Draw(final_image)
        
        # Legend positioning
        legend_x = 30
        legend_y = 30
        legend_width = 280
        legend_height = 300
        
        # Draw legend background with shadow effect
        # First draw shadow
        shadow_color = (0, 0, 0, 50)  # Semi-transparent black
        draw.rectangle(
            (legend_x + 3, legend_y + 3, legend_x + legend_width + 3, legend_y + legend_height + 3),
            fill=shadow_color
        )
        
        # Then draw main legend background
        draw.rectangle(
            (legend_x, legend_y, legend_x + legend_width, legend_y + legend_height),
            fill=style_config.colors['legend_bg'],
            outline=style_config.colors['text'],
            width=1
        )
        
        # Draw legend title
        title_text = "Florida Surf Breaks"
        draw.text((legend_x + 15, legend_y + 15), title_text, 
                 fill=style_config.colors['text'], font=title_font)
        
        # Draw break type entries
        y_offset = legend_y + 50
        for break_type, color in self.BREAK_TYPE_COLORS.items():
            # Draw color indicator
            draw.rectangle(
                (legend_x + 15, y_offset, legend_x + 35, y_offset + 12),
                fill=color,
                outline=style_config.colors['text'],
                width=1
            )
            
            # Draw break type text
            draw.text((legend_x + 45, y_offset - 2), break_type, 
                     fill=style_config.colors['text'], font=type_font)
            
            y_offset += 20
        
        return final_image
    
    def generate_poster(self, map_image_path: str, output_path: str, 
                       style: PosterStyle = PosterStyle.CLASSIC,
                       custom_bounds: Optional[MapBounds] = None,
                       title: Optional[str] = None) -> bool:
        """
        Generate a professional surf break poster.
        
        Args:
            map_image_path: Path to the base Florida map image
            output_path: Path where the final poster will be saved
            style: Poster style to apply
            custom_bounds: Custom geographic bounds (uses default if None)
            title: Custom title for the poster
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Load and validate inputs
            if not Path(map_image_path).exists():
                logger.error(f"Map image not found: {map_image_path}")
                return False
            
            style_config = self.style_configs[style]
            bounds = custom_bounds or self.DEFAULT_BOUNDS
            
            # Load base image
            base_image = Image.open(map_image_path).convert("RGBA")
            img_width, img_height = base_image.size
            
            # Create enhanced background
            enhanced_image = self._enhance_background(base_image, style_config)
            draw = ImageDraw.Draw(enhanced_image)
            
            # Load fonts
            name_font = self._get_font(style_config, 'name')
            type_font = self._get_font(style_config, 'type')
            
            # Process surf breaks
            placed_breaks = 0
            for surf_break in self.surf_breaks:
                x, y = self._lat_lon_to_pixel(
                    surf_break.latitude, surf_break.longitude,
                    img_width, img_height, bounds
                )
                
                # Check if point is within image bounds
                if not (0 <= x < img_width and 0 <= y < img_height):
                    continue
                
                # Draw enhanced marker
                self._draw_enhanced_marker(draw, x, y, surf_break.break_type, style_config)
                
                # Calculate label position
                label_x, label_y, direction = self._calculate_label_position(
                    x, y, img_width, img_height, bounds
                )
                
                # Draw connection line
                self._draw_connection_line(draw, x, y, label_x, label_y, 
                                         surf_break.break_type, style_config)
                
                # Draw labels
                name_w, name_h = self._draw_enhanced_text(
                    draw, label_x, label_y, surf_break.name, name_font, style_config
                )
                
                type_text = f"({surf_break.break_type})"
                self._draw_enhanced_text(
                    draw, label_x, label_y + name_h + 2, type_text, type_font, style_config
                )
                
                placed_breaks += 1
            
            # Add legend
            final_image = self._create_legend(enhanced_image, style_config)
            
            # Add title if provided
            if title:
                final_image = self._add_title(final_image, title, style_config)
            
            # Save final poster
            final_image.save(output_path, quality=95, optimize=True)
            
            logger.info(f"Poster generated successfully: {output_path}")
            logger.info(f"Placed {placed_breaks} surf breaks")
            
            return True
            
        except Exception as e:
            logger.error(f"Error generating poster: {e}")
            return False
    
    def _enhance_background(self, image: Image.Image, style_config: StyleConfig) -> Image.Image:
        """Apply background enhancements based on style"""
        enhanced = image.copy()
        
        for effect in style_config.background_effects:
            if effect == 'sepia':
                enhanced = self._apply_sepia(enhanced)
            elif effect == 'noise':
                enhanced = self._add_noise(enhanced)
            elif effect == 'subtle_texture':
                enhanced = self._add_subtle_texture(enhanced)
        
        return enhanced
    
    def _apply_sepia(self, image: Image.Image) -> Image.Image:
        """Apply sepia tone effect"""
        # Convert to grayscale first
        grayscale = image.convert('L')
        
        # Apply sepia toning
        sepia = Image.new('RGBA', image.size)
        sepia_pixels = []
        
        for pixel in grayscale.getdata():
            # Sepia formula
            tr = int(pixel * 0.393 + pixel * 0.769 + pixel * 0.189)
            tg = int(pixel * 0.349 + pixel * 0.686 + pixel * 0.168)
            tb = int(pixel * 0.272 + pixel * 0.534 + pixel * 0.131)
            
            sepia_pixels.append((min(255, tr), min(255, tg), min(255, tb), 255))
        
        sepia.putdata(sepia_pixels)
        return sepia
    
    def _add_noise(self, image: Image.Image) -> Image.Image:
        """Add subtle noise texture"""
        import random
        
        enhanced = image.copy()
        pixels = list(enhanced.getdata())
        
        for i, pixel in enumerate(pixels):
            if random.random() < 0.1:  # 10% of pixels
                noise = random.randint(-20, 20)
                new_pixel = tuple(max(0, min(255, c + noise)) for c in pixel[:3]) + (pixel[3],)
                pixels[i] = new_pixel
        
        enhanced.putdata(pixels)
        return enhanced
    
    def _add_subtle_texture(self, image: Image.Image) -> Image.Image:
        """Add subtle paper texture"""
        # Simple texture by slightly varying brightness
        enhancer = ImageEnhance.Contrast(image)
        return enhancer.enhance(1.1)
    
    def _add_title(self, image: Image.Image, title: str, style_config: StyleConfig) -> Image.Image:
        """Add title to the poster"""
        # Work with a copy of the image
        titled_image = image.copy()
        draw = ImageDraw.Draw(titled_image)
        title_font = self._get_font(style_config, 'title')
        
        # Calculate title position (centered at top)
        bbox = draw.textbbox((0, 0), title, font=title_font)
        title_width = bbox[2] - bbox[0]
        title_x = (image.width - title_width) // 2
        title_y = 30
        
        # Draw title with enhanced styling
        self._draw_enhanced_text(draw, title_x, title_y, title, title_font, style_config)
        
        return titled_image


def main():
    """Example usage of the FloridaSurfBreakPosterService"""
    
    # Configuration
    MAP_IMAGE_PATH = 'florida.png'
    OUTPUT_PATH = 'florida_surf_breaks_poster.png'
    DATA_PATH = 'scrapers/data/florida_surf_breaks_full.json'
    
    try:
        # Initialize the service
        poster_service = FloridaSurfBreakPosterService(data_path=DATA_PATH)
        
        # Generate a classic style poster
        success = poster_service.generate_poster(
            map_image_path=MAP_IMAGE_PATH,
            output_path=OUTPUT_PATH,
            style=PosterStyle.CLASSIC,
            title="Florida Surf Breaks - Classic Edition"
        )
        
        if success:
            print(f"✅ Poster generated successfully: {OUTPUT_PATH}")
        else:
            print("❌ Failed to generate poster")
            
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()