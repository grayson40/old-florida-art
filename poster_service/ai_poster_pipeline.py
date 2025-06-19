"""
AI-Powered Florida Surf Break Poster Pipeline

Complete end-to-end pipeline that:
1. Generates AI-powered Florida map templates using Replicate
2. Applies surf break markers and labels using the poster service
3. Creates production-ready posters optimized for coastal text placement
"""

import os
import sys
import logging
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass

# Add services directory to path
sys.path.append(str(Path(__file__).parent / 'services'))

from services.replicate import FloridaMapGenerator, MapStyle
from services.poster import FloridaSurfBreakPosterService, PosterStyle, MapBounds

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class PosterConfig:
    """Configuration for a poster generation job"""
    ai_map_style: MapStyle
    poster_style: PosterStyle
    output_name: str
    title: str
    width: int = 1024
    height: int = 1024


class AIPosterPipeline:
    """
    Complete AI-powered poster generation pipeline.
    
    This pipeline combines AI map generation with surf break overlay
    to create professional posters from scratch.
    """
    
    # Style mappings between AI map styles and poster styles
    STYLE_MAPPINGS = {
        MapStyle.CLASSIC: PosterStyle.CLASSIC,
        MapStyle.VINTAGE: PosterStyle.VINTAGE,
        MapStyle.MINIMALIST: PosterStyle.MINIMALIST,
        MapStyle.WATERCOLOR: PosterStyle.CLASSIC,  # Use classic overlay for watercolor
        MapStyle.RETRO: PosterStyle.VINTAGE,       # Use vintage overlay for retro
        MapStyle.ART_DECO: PosterStyle.VINTAGE,    # Use vintage overlay for art deco
        MapStyle.BOTANICAL: PosterStyle.CLASSIC,   # Use classic overlay for botanical
    }
    
    def __init__(self, replicate_api_token: Optional[str] = None):
        """
        Initialize the AI poster pipeline.
        
        Args:
            replicate_api_token: Replicate API token for AI generation
        """
        try:
            # Initialize map generator
            self.map_generator = FloridaMapGenerator(api_token=replicate_api_token)
            
            # Initialize poster service
            self.poster_service = FloridaSurfBreakPosterService()
            
            # Create directories
            self.templates_dir = Path("ai_generated_templates")
            self.output_dir = Path("ai_generated_posters")
            self.templates_dir.mkdir(exist_ok=True)
            self.output_dir.mkdir(exist_ok=True)
            
            logger.info("AI Poster Pipeline initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize pipeline: {e}")
            raise
    
    def generate_single_poster(
        self,
        ai_style: MapStyle,
        poster_title: str,
        output_name: Optional[str] = None,
        width: int = 1024,
        height: int = 1024,
        model: str = 'flux-schnell'
    ) -> str:
        """
        Generate a complete poster from scratch using AI.
        
        Args:
            ai_style: AI map style to generate
            poster_title: Title for the poster
            output_name: Custom output filename (optional)
            width: Image width in pixels
            height: Image height in pixels
            model: AI model to use for map generation
            
        Returns:
            str: Path to the generated poster
        """
        if output_name is None:
            output_name = f"ai_poster_{ai_style.value}"
        
        logger.info(f"🎨 Starting AI poster generation: {ai_style.value}")
        
        try:
            # Step 1: Generate AI map template
            logger.info("📍 Generating AI map template...")
            template_path = self.templates_dir / f"template_{ai_style.value}.png"
            
            map_path = self.map_generator.generate_map_template(
                style=ai_style,
                width=width,
                height=height,
                model=model,
                save_path=str(template_path)
            )
            
            logger.info(f"✅ AI map template generated: {map_path}")
            
            # Step 2: Apply surf break overlays
            logger.info("🏄‍♂️ Adding surf break markers and labels...")
            poster_style = self.STYLE_MAPPINGS[ai_style]
            final_poster_path = self.output_dir / f"{output_name}.png"
            
            success = self.poster_service.generate_poster(
                map_image_path=map_path,
                output_path=str(final_poster_path),
                style=poster_style,
                title=poster_title
            )
            
            if success:
                logger.info(f"🎉 Complete AI poster generated: {final_poster_path}")
                return str(final_poster_path)
            else:
                raise Exception("Failed to generate poster overlay")
                
        except Exception as e:
            logger.error(f"Error generating {ai_style.value} poster: {e}")
            raise
    
    def generate_poster_collection(
        self,
        collection_name: str = "Florida Surf Collection",
        styles_to_generate: Optional[List[MapStyle]] = None,
        width: int = 1024,
        height: int = 1024,
        model: str = 'flux-schnell'
    ) -> Dict[MapStyle, str]:
        """
        Generate a complete collection of posters in different AI styles.
        
        Args:
            collection_name: Base name for the collection
            styles_to_generate: List of styles to generate (defaults to all)
            width: Image width in pixels
            height: Image height in pixels
            model: AI model to use
            
        Returns:
            Dict mapping styles to their generated poster paths
        """
        if styles_to_generate is None:
            styles_to_generate = list(MapStyle)
        
        logger.info(f"🎨 Generating poster collection: {collection_name}")
        logger.info(f"📊 Styles to generate: {[s.value for s in styles_to_generate]}")
        
        generated_posters = {}
        
        for ai_style in styles_to_generate:
            try:
                logger.info(f"\n🖼️  Processing {ai_style.value} style...")
                
                poster_title = f"{collection_name} - {ai_style.value.title()} Edition"
                output_name = f"collection_{ai_style.value}_poster"
                
                poster_path = self.generate_single_poster(
                    ai_style=ai_style,
                    poster_title=poster_title,
                    output_name=output_name,
                    width=width,
                    height=height,
                    model=model
                )
                
                generated_posters[ai_style] = poster_path
                logger.info(f"✅ {ai_style.value.title()} poster completed")
                
            except Exception as e:
                logger.error(f"❌ Failed to generate {ai_style.value} poster: {e}")
                continue
        
        logger.info(f"\n🎉 Collection complete! Generated {len(generated_posters)} posters")
        return generated_posters
    
    def generate_custom_poster(
        self,
        custom_prompt: str,
        poster_title: str,
        output_name: str,
        poster_style: PosterStyle = PosterStyle.CLASSIC,
        width: int = 1024,
        height: int = 1024,
        model: str = 'flux-schnell'
    ) -> str:
        """
        Generate a poster with a custom AI map prompt.
        
        Args:
            custom_prompt: Custom prompt for AI map generation
            poster_title: Title for the final poster
            output_name: Name for output files
            poster_style: Poster overlay style to use
            width: Image width in pixels
            height: Image height in pixels
            model: AI model to use
            
        Returns:
            str: Path to the generated poster
        """
        logger.info(f"🛠️  Generating custom poster: {output_name}")
        
        try:
            # Step 1: Generate custom AI map
            template_path = self.templates_dir / f"custom_{output_name}_template.png"
            
            map_path = self.map_generator.generate_custom_map(
                custom_prompt=custom_prompt,
                style_name=output_name,
                width=width,
                height=height,
                model=model,
                save_path=str(template_path)
            )
            
            logger.info(f"✅ Custom AI map generated: {map_path}")
            
            # Step 2: Apply surf break overlays
            final_poster_path = self.output_dir / f"custom_{output_name}.png"
            
            success = self.poster_service.generate_poster(
                map_image_path=map_path,
                output_path=str(final_poster_path),
                style=poster_style,
                title=poster_title
            )
            
            if success:
                logger.info(f"🎉 Custom poster completed: {final_poster_path}")
                return str(final_poster_path)
            else:
                raise Exception("Failed to generate custom poster overlay")
                
        except Exception as e:
            logger.error(f"Error generating custom poster: {e}")
            raise
    
    def get_pipeline_status(self) -> Dict:
        """Get status information about the pipeline"""
        return {
            'templates_directory': str(self.templates_dir),
            'output_directory': str(self.output_dir),
            'available_ai_styles': [style.value for style in MapStyle],
            'available_poster_styles': [style.value for style in PosterStyle],
            'available_models': self.map_generator.get_available_models(),
            'templates_generated': len(list(self.templates_dir.glob("*.png"))),
            'posters_generated': len(list(self.output_dir.glob("*.png")))
        }


def main():
    """Example usage of the AI Poster Pipeline"""
    
    # Check for API token
    if not os.getenv('REPLICATE_API_TOKEN'):
        print("❌ REPLICATE_API_TOKEN environment variable is required!")
        print("Get your token at: https://replicate.com/account/api-tokens")
        print("Then run: export REPLICATE_API_TOKEN=your_token_here")
        return
    
    try:
        # Initialize pipeline
        pipeline = AIPosterPipeline()
        
        print("🎨 AI-Powered Florida Surf Break Poster Pipeline")
        print("=" * 50)
        
        # Example 1: Generate a single poster
        print("\n📍 Generating single AI poster...")
        single_poster = pipeline.generate_single_poster(
            ai_style=MapStyle.CLASSIC,
            poster_title="Florida Surf Breaks - AI Generated Classic",
            output_name="ai_classic_demo",
            width=1024,
            height=1024
        )
        print(f"✅ Single poster: {single_poster}")
        
        # Example 2: Generate a collection (limited for demo)
        print("\n🎨 Generating poster collection...")
        demo_styles = [MapStyle.CLASSIC, MapStyle.VINTAGE, MapStyle.MINIMALIST]
        collection = pipeline.generate_poster_collection(
            collection_name="AI Florida Surf Collection",
            styles_to_generate=demo_styles,
            width=1024,
            height=1024
        )
        
        print(f"\n📊 Collection Results:")
        for style, path in collection.items():
            print(f"  • {style.value}: {Path(path).name}")
        
        # Example 3: Custom poster
        print("\n🛠️  Generating custom poster...")
        custom_prompt = (
            "Psychedelic 1960s style Florida map, vibrant neon colors, "
            "groovy patterns, tie-dye effects, peace symbols, "
            "vintage concert poster aesthetic"
        )
        
        custom_poster = pipeline.generate_custom_poster(
            custom_prompt=custom_prompt,
            poster_title="Florida Surf Breaks - Psychedelic Edition",
            output_name="psychedelic_surf",
            poster_style=PosterStyle.VINTAGE
        )
        print(f"✅ Custom poster: {custom_poster}")
        
        # Pipeline status
        print("\n📊 Pipeline Status:")
        status = pipeline.get_pipeline_status()
        for key, value in status.items():
            print(f"  • {key}: {value}")
        
        print(f"\n🎉 AI Pipeline Demo Complete!")
        print(f"📁 Check '{status['output_directory']}' for your generated posters")
        
    except Exception as e:
        print(f"❌ Pipeline Error: {e}")


if __name__ == "__main__":
    main() 