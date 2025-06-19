#!/usr/bin/env python3
"""
Replicate AI Service for Florida Map Template Generation

This service uses Replicate's AI models to generate stylized Florida map templates
optimized for surf break poster creation with proper coastal spacing for text labels.
"""

import os
import requests
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from enum import Enum

# Try to load dotenv if available
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ Loaded .env file")
except ImportError:
    print("⚠️  python-dotenv not installed. Install with: pip install python-dotenv")
except Exception as e:
    print(f"⚠️  Could not load .env file: {e}")

# Try to import replicate with better error handling
try:
    import replicate
    print("✅ Replicate module imported successfully")
except ImportError:
    print("❌ Replicate package not found. Install with: pip install replicate")
    raise ImportError("Please install replicate: pip install replicate")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MapStyle(Enum):
    """Available map styles for AI generation"""
    CLASSIC = "classic"
    VINTAGE = "vintage"
    MINIMALIST = "minimalist"
    WATERCOLOR = "watercolor"
    RETRO = "retro"
    ART_DECO = "art_deco"
    BOTANICAL = "botanical"


class FloridaMapGenerator:
    """
    Service for generating AI-powered Florida map templates using Replicate API.
    
    Generates stylized Florida maps optimized for surf break poster creation
    with proper coastal spacing and visual clarity for text labels.
    """
    
    # Model configurations for different AI models
    MODELS = {
        'flux-schnell': 'black-forest-labs/flux-schnell',
        'flux-dev': 'black-forest-labs/flux-dev',
        'sdxl': 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b'
    }
    
    # Style-specific prompts optimized for surf break labeling
    STYLE_PROMPTS = {
        MapStyle.CLASSIC: {
            'prompt': "Professional cartographic map of Florida state, clean white background, "
                     "detailed coastline with ample white margins around the entire perimeter for text labels, "
                     "wide coastal buffer zones for surf break text placement, subtle blue ocean areas, "
                     "light gray state boundaries, minimal interior details, high contrast, "
                     "perfect for adding surf break markers and text overlays, cartographic style, no text or labels",
            'style_keywords': "professional, cartographic, clean, minimal"
        },
        
        MapStyle.VINTAGE: {
            'prompt': "Vintage 1940s travel poster style map of Florida, weathered parchment background, "
                     "faded sepia and cream tones, art deco styling, distressed texture, "
                     "wide coastal margins perfect for vintage-style text placement, "
                     "retro tourism aesthetic, warm earth tones, aged paper effect, "
                     "clear state outline, no text or modern elements",
            'style_keywords': "vintage, art deco, sepia, weathered, retro"
        },
        
        MapStyle.MINIMALIST: {
            'prompt': "Ultra-minimalist line art map of Florida, pure white background, "
                     "single black line outline of the state, maximum white space around coastline for text labels, "
                     "wide coastal margins perfect for surf break labeling, geometric simplicity, "
                     "clean vector-style design, perfect negative space for text placement, scandinavian design aesthetic, "
                     "no fill colors, no interior details, just the essential outline",
            'style_keywords': "minimalist, line art, geometric, clean, scandinavian"
        },
        
        MapStyle.WATERCOLOR: {
            'prompt': "Watercolor painting of Florida map, soft pastel blues and greens, "
                     "gentle paint bleeding effects, artistic brush strokes, light washes of color, "
                     "plenty of white paper showing around the edges for text space, "
                     "dreamy aquarelle technique, coastal waters in soft blue tones, "
                     "artistic interpretation, no text, organic paint textures",
            'style_keywords': "watercolor, pastel, soft, artistic, aquarelle"
        },
        
        MapStyle.RETRO: {
            'prompt': "1970s surf culture style map of Florida, warm sunset colors, "
                     "orange, coral, and teal color palette, retro typography spacing considerations, "
                     "vintage surf aesthetic, faded sun-bleached appearance, "
                     "wide coastal buffer zones for retro-style text placement, "
                     "California dreaming meets Florida vibes, no text elements",
            'style_keywords': "retro, 1970s, surf culture, sunset colors, vintage"
        },
        
        MapStyle.ART_DECO: {
            'prompt': "Art Deco style Florida map, 1920s Miami glamour aesthetic, "
                     "geometric patterns, metallic gold and turquoise accents, elegant curves and angular design elements, "
                     "sophisticated color palette, generous white margins around entire coastline for elegant text styling, "
                     "wide coastal buffer zones perfect for art deco typography, luxury hotel poster aesthetic, "
                     "streamline moderne influence, no text",
            'style_keywords': "art deco, geometric, elegant, luxury, 1920s"
        },
        
        MapStyle.BOTANICAL: {
            'prompt': "Botanical illustration style Florida map, detailed natural elements, "
                     "palm fronds, orange blossoms, and coastal plants integrated into design, "
                     "scientific illustration aesthetic, soft natural colors, "
                     "hand-drawn botanical accuracy, white background with plant details, "
                     "ample space around coastline for scientific-style labeling, "
                     "nature field guide aesthetic, no text labels",
            'style_keywords': "botanical, natural, scientific, detailed, hand-drawn"
        }
    }
    
    def __init__(self, api_token: Optional[str] = None):
        """
        Initialize the Florida Map Generator.
        
        Args:
            api_token: Replicate API token. If None, reads from REPLICATE_API_TOKEN environment variable
        """
        # Try multiple ways to get the API token
        self.api_token = (
            api_token or 
            os.getenv('REPLICATE_API_TOKEN') or 
            os.environ.get('REPLICATE_API_TOKEN')
        )
        
        if not self.api_token:
            print("❌ No Replicate API token found!")
            print("📋 To fix this:")
            print("1. Get token: https://replicate.com/account/api-tokens")
            print("2. Set environment variable:")
            print("   export REPLICATE_API_TOKEN=your_token_here")
            print("3. Or create a .env file with:")
            print("   REPLICATE_API_TOKEN=your_token_here")
            raise ValueError(
                "Replicate API token required. Set REPLICATE_API_TOKEN environment variable "
                "or pass api_token parameter"
            )
        
        # Set the API token for the replicate client
        os.environ['REPLICATE_API_TOKEN'] = self.api_token
        print(f"✅ API token loaded: {self.api_token[:10]}...")
    
    def generate_map_template(
        self, 
        style: MapStyle, 
        width: int = 1024, 
        height: int = 1024,
        model: str = 'flux-schnell',
        save_path: Optional[str] = None
    ) -> str:
        """
        Generate a Florida map template in the specified style.
        
        Args:
            style: Map style to generate
            width: Image width in pixels
            height: Image height in pixels
            model: AI model to use for generation
            save_path: Optional path to save the generated image
            
        Returns:
            str: Path to the generated image file
        """
        if model not in self.MODELS:
            raise ValueError(f"Unsupported model: {model}. Available: {list(self.MODELS.keys())}")
        
        style_config = self.STYLE_PROMPTS[style]
        
        # Enhanced prompt with specific requirements for surf break labeling
        enhanced_prompt = (
            f"{style_config['prompt']} "
            f"IMPORTANT: Ensure wide margins around the entire coastline (at least 15% of image width) "
            f"for text label placement. The state outline should be centered with generous white space "
            f"or background space around all edges. Optimize for text readability and label placement. "
            f"Style: {style_config['style_keywords']}"
        )
        
        logger.info(f"Generating {style.value} style Florida map using {model}")
        logger.info(f"Dimensions: {width}x{height}")
        
        try:
            # Test that replicate.run exists
            if not hasattr(replicate, 'run'):
                raise AttributeError(
                    "replicate.run not found. You may have an old version of replicate. "
                    "Try: pip install --upgrade replicate"
                )
            
            # Generate the image using Replicate
            output = replicate.run(
                self.MODELS[model],
                input={
                    "prompt": enhanced_prompt,
                    "width": width,
                    "height": height,
                    "num_outputs": 1,
                    "quality": 95,
                    "guidance": 7.5,  # Good balance for following prompt
                }
            )
            
            # Handle the output
            if isinstance(output, list) and len(output) > 0:
                image_url = str(output[0])
            else:
                image_url = str(output)
            
            # Download and save the image
            image_path = self._download_image(image_url, style, save_path)
            
            logger.info(f"Successfully generated {style.value} map: {image_path}")
            return image_path
            
        except Exception as e:
            logger.error(f"Error generating {style.value} map: {e}")
            raise
    
    def generate_all_styles(
        self, 
        output_dir: str = "generated_maps",
        width: int = 1024,
        height: int = 1024,
        model: str = 'flux-schnell'
    ) -> Dict[MapStyle, str]:
        """
        Generate Florida map templates in all available styles.
        
        Args:
            output_dir: Directory to save generated maps
            width: Image width in pixels
            height: Image height in pixels
            model: AI model to use for generation
            
        Returns:
            Dict mapping styles to their generated file paths
        """
        # Create output directory
        Path(output_dir).mkdir(exist_ok=True)
        
        generated_maps = {}
        
        for style in MapStyle:
            try:
                save_path = os.path.join(output_dir, f"florida_map_{style.value}.png")
                
                map_path = self.generate_map_template(
                    style=style,
                    width=width,
                    height=height,
                    model=model,
                    save_path=save_path
                )
                
                generated_maps[style] = map_path
                logger.info(f"✅ Generated {style.value} style map")
                
            except Exception as e:
                logger.error(f"❌ Failed to generate {style.value} style: {e}")
                continue
        
        logger.info(f"Generated {len(generated_maps)} map templates in {output_dir}")
        return generated_maps
    
    def generate_custom_map(
        self,
        custom_prompt: str,
        style_name: str = "custom",
        width: int = 1024,
        height: int = 1024,
        model: str = 'flux-schnell',
        save_path: Optional[str] = None
    ) -> str:
        """
        Generate a Florida map with a fully custom prompt.
        
        Args:
            custom_prompt: Custom prompt for map generation
            style_name: Name for the custom style (used in filename)
            width: Image width in pixels
            height: Image height in pixels
            model: AI model to use
            save_path: Optional path to save the generated image
            
        Returns:
            str: Path to the generated image file
        """
        if model not in self.MODELS:
            raise ValueError(f"Unsupported model: {model}. Available: {list(self.MODELS.keys())}")
        
        # Add coastal spacing requirements to any custom prompt
        enhanced_prompt = (
            f"{custom_prompt} "
            f"CRITICAL: Include wide margins around the entire Florida coastline "
            f"(minimum 15% of image dimensions) for text label placement. "
            f"Center the state with generous background space on all sides."
        )
        
        logger.info(f"Generating custom Florida map: {style_name}")
        
        try:
            output = replicate.run(
                self.MODELS[model],
                input={
                    "prompt": enhanced_prompt,
                    "width": width,
                    "height": height,
                    "num_outputs": 1,
                    "quality": 95,
                    "guidance": 7.5,
                }
            )
            
            # Handle the output
            if isinstance(output, list) and len(output) > 0:
                image_url = str(output[0])
            else:
                image_url = str(output)
            
            # Create a temporary MapStyle for the custom style
            class CustomStyle(Enum):
                CUSTOM = style_name
            
            image_path = self._download_image(image_url, CustomStyle.CUSTOM, save_path)
            
            logger.info(f"Successfully generated custom map: {image_path}")
            return image_path
            
        except Exception as e:
            logger.error(f"Error generating custom map: {e}")
            raise
    
    def _download_image(self, image_url: str, style, save_path: Optional[str] = None) -> str:
        """Download image from URL and save locally"""
        if save_path is None:
            filename = f"florida_map_{style.value if hasattr(style, 'value') else str(style)}.png"
            save_path = filename
        
        try:
            response = requests.get(image_url, timeout=30)
            response.raise_for_status()
            
            # Ensure directory exists
            Path(save_path).parent.mkdir(parents=True, exist_ok=True)
            
            with open(save_path, 'wb') as f:
                f.write(response.content)
            
            return save_path
            
        except Exception as e:
            logger.error(f"Error downloading image: {e}")
            raise
    
    def get_available_models(self) -> List[str]:
        """Get list of available AI models"""
        return list(self.MODELS.keys())
    
    def get_available_styles(self) -> List[str]:
        """Get list of available map styles"""
        return [style.value for style in MapStyle]


def main():
    """Example usage of the Florida Map Generator"""
    try:
        # Initialize the generator
        generator = FloridaMapGenerator()
        
        print("🗺️  Florida Map Template Generator")
        print("=" * 40)
        
        # Generate a single map
        print("\n📍 Generating a Classic style map...")
        classic_map = generator.generate_map_template(
            style=MapStyle.CLASSIC,
            width=1024,
            height=1024,
            save_path="templates/florida_classic_template.png"
        )
        print(f"✅ Classic map saved: {classic_map}")
        
        # Generate all styles
        print("\n🎨 Generating all map styles...")
        all_maps = generator.generate_all_styles(
            output_dir="templates",
            width=1024,
            height=1024
        )
        
        print(f"\n🎉 Generated {len(all_maps)} map templates:")
        for style, path in all_maps.items():
            print(f"  • {style.value}: {path}")
        
        # Generate custom map
        print("\n🛠️  Generating custom map...")
        custom_prompt = (
            "Hand-drawn vintage nautical chart of Florida, "
            "compass roses, depth soundings, sailing routes, "
            "aged parchment with sea monster illustrations"
        )
        
        custom_map = generator.generate_custom_map(
            custom_prompt=custom_prompt,
            style_name="nautical_chart",
            save_path="templates/florida_nautical_template.png"
        )
        print(f"✅ Custom nautical map saved: {custom_map}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure to set your REPLICATE_API_TOKEN environment variable!")


if __name__ == "__main__":
    main()
