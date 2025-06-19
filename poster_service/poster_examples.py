#!/usr/bin/env python3
"""
Usage examples for the Florida Surf Break Poster Service

This file demonstrates how to use the production-ready poster service
with different styles and configurations.
"""

from services.poster import FloridaSurfBreakPosterService, PosterStyle, MapBounds


def generate_all_styles():
    """Generate posters in all available styles"""
    
    # Configuration
    MAP_IMAGE_PATH = 'florida.png'
    DATA_PATH = 'scrapers/data/florida_surf_breaks_full.json'
    
    try:
        # Initialize the service
        poster_service = FloridaSurfBreakPosterService(data_path=DATA_PATH)
        
        # Generate posters in different styles
        styles = [
            (PosterStyle.CLASSIC, "Classic Edition"),
            (PosterStyle.VINTAGE, "Vintage Collection"),
            (PosterStyle.MINIMALIST, "Minimalist Design")
        ]
        
        for style, edition in styles:
            output_path = f'florida_surf_breaks_{style.value}.png'
            title = f"Florida Surf Breaks - {edition}"
            
            print(f"🎨 Generating {style.value} style poster...")
            
            success = poster_service.generate_poster(
                map_image_path=MAP_IMAGE_PATH,
                output_path=output_path,
                style=style,
                title=title
            )
            
            if success:
                print(f"✅ {style.value.title()} poster saved to: {output_path}")
            else:
                print(f"❌ Failed to generate {style.value} poster")
                
    except Exception as e:
        print(f"❌ Error: {e}")


def generate_custom_bounds_poster():
    """Generate a poster with custom geographic bounds (e.g., just South Florida)"""
    
    MAP_IMAGE_PATH = 'south_florida.png'  # Assume you have a cropped South FL map
    OUTPUT_PATH = 'south_florida_surf_breaks.png'
    DATA_PATH = 'scrapers/data/florida_surf_breaks_full.json'
    
    # Custom bounds for South Florida only
    south_florida_bounds = MapBounds(
        min_lat=24.5,   # Key West
        max_lat=27.0,   # Around Fort Lauderdale
        min_lon=-82.0,  # West coast
        max_lon=-79.9   # East coast
    )
    
    try:
        poster_service = FloridaSurfBreakPosterService(data_path=DATA_PATH)
        
        success = poster_service.generate_poster(
            map_image_path=MAP_IMAGE_PATH,
            output_path=OUTPUT_PATH,
            style=PosterStyle.VINTAGE,
            custom_bounds=south_florida_bounds,
            title="South Florida Surf Breaks"
        )
        
        if success:
            print(f"✅ South Florida poster saved to: {OUTPUT_PATH}")
        else:
            print("❌ Failed to generate South Florida poster")
            
    except Exception as e:
        print(f"❌ Error: {e}")


def batch_generate_posters():
    """Generate multiple posters with different configurations"""
    
    configurations = [
        {
            'map_image_path': 'florida.png',
            'output_path': 'florida_classic_poster.png',
            'style': PosterStyle.CLASSIC,
            'title': 'Florida Surf Breaks - Professional Edition'
        },
        {
            'map_image_path': 'florida.png',
            'output_path': 'florida_vintage_poster.png',
            'style': PosterStyle.VINTAGE,
            'title': 'Florida Surf Breaks - Retro Collection'
        },
        {
            'map_image_path': 'florida.png',
            'output_path': 'florida_minimal_poster.png',
            'style': PosterStyle.MINIMALIST,
            'title': 'Florida Surf Breaks - Clean Design'
        }
    ]
    
    try:
        poster_service = FloridaSurfBreakPosterService()
        
        for config in configurations:
            print(f"🎨 Generating {config['style'].value} poster...")
            
            success = poster_service.generate_poster(**config)
            
            if success:
                print(f"✅ Saved: {config['output_path']}")
            else:
                print(f"❌ Failed: {config['output_path']}")
                
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    print("🏄‍♂️ Florida Surf Break Poster Generator Examples")
    print("=" * 50)
    
    # Generate all styles
    print("\n1. Generating all poster styles...")
    generate_all_styles()
    
    # Generate custom bounds example
    print("\n2. Generating custom bounds poster...")
    generate_custom_bounds_poster()
    
    # Batch generation example
    print("\n3. Batch generating posters...")
    batch_generate_posters()
    
    print("\n🎉 All examples completed!") 