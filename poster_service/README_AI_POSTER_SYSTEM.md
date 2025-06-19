# 🏄‍♂️ AI-Powered Florida Surf Break Poster System

A complete end-to-end system for generating professional Florida surf break posters using AI-generated map templates with optimal coastal spacing for text labels.

## 🎯 System Overview

This system combines:
1. **AI Map Generation** - Creates stylized Florida map templates using Replicate API
2. **Surf Break Data Processing** - Loads and validates surf break locations
3. **Poster Generation** - Overlays surf break markers and labels with professional styling
4. **Production Pipeline** - Automated workflow from AI generation to final poster

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Replicate     │    │   Surf Break    │    │  Final Poster   │
│  AI Map Gen     │───▶│   Overlay       │───▶│   Generation    │
│ (7 Styles)      │    │  Service        │    │ (Production)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
  florida_classic.png    surf_breaks.json    poster_final.png
```

## 🚀 Quick Start

### 1. Setup

```bash
# Install dependencies
pip install replicate pillow requests

# Get Replicate API token
# Go to: https://replicate.com/account/api-tokens
export REPLICATE_API_TOKEN=your_token_here

# Test the system
python test_replicate_service.py
```

### 2. Generate AI Maps + Posters

```python
from ai_poster_pipeline import AIPosterPipeline
from services.replicate import MapStyle

# Initialize pipeline
pipeline = AIPosterPipeline()

# Generate single poster from scratch
poster = pipeline.generate_single_poster(
    ai_style=MapStyle.CLASSIC,
    poster_title="Florida Surf Breaks - Classic Edition"
)

print(f"Generated: {poster}")
```

### 3. Batch Generation

```python
# Generate multiple styles
collection = pipeline.generate_poster_collection(
    collection_name="Florida Surf Collection",
    styles_to_generate=[MapStyle.CLASSIC, MapStyle.VINTAGE, MapStyle.MINIMALIST]
)
```

## 🎨 Available Styles

### AI Map Styles
- **Classic** - Professional cartographic with clean margins
- **Vintage** - 1940s travel poster with aged paper texture
- **Minimalist** - Pure line art with maximum white space
- **Watercolor** - Artistic paint effects with soft edges
- **Retro** - 1970s surf culture with sunset colors
- **Art Deco** - 1920s Miami glamour with geometric patterns
- **Botanical** - Scientific illustration with natural elements

### Poster Overlay Styles
- **Classic** - Professional typography with shadows
- **Vintage** - Aged styling with sepia effects
- **Minimalist** - Clean, simple text placement

## 📁 File Structure

```
fl-shop/
├── services/
│   └── replicate.py              # AI map generation service
├── scrapers/
│   └── data/
│       └── florida_surf_breaks_full.json  # Surf break data
├── test.py                       # Poster overlay service
├── ai_poster_pipeline.py         # Complete pipeline
├── test_replicate_service.py     # Testing utilities
├── ai_generated_templates/       # Generated AI maps
└── ai_generated_posters/         # Final posters
```

## 🛠️ Core Services

### FloridaMapGenerator (services/replicate.py)

Generates AI-powered Florida map templates optimized for surf break labeling.

```python
from services.replicate import FloridaMapGenerator, MapStyle

generator = FloridaMapGenerator()

# Single map
map_path = generator.generate_map_template(
    style=MapStyle.CLASSIC,
    width=1024,
    height=1024,
    save_path="florida_classic.png"
)

# All styles
all_maps = generator.generate_all_styles(output_dir="templates")

# Custom prompt
custom_map = generator.generate_custom_map(
    custom_prompt="Cyberpunk neon Florida map with glowing coastline",
    style_name="cyberpunk"
)
```

### FloridaSurfBreakPosterService (test.py)

Professional poster generation with surf break overlays.

```python
from test import FloridaSurfBreakPosterService, PosterStyle

service = FloridaSurfBreakPosterService()

success = service.generate_poster(
    map_image_path="florida_map.png",
    output_path="final_poster.png",
    style=PosterStyle.CLASSIC,
    title="Florida Surf Breaks"
)
```

### AIPosterPipeline (ai_poster_pipeline.py)

Complete end-to-end automation.

```python
from ai_poster_pipeline import AIPosterPipeline

pipeline = AIPosterPipeline()

# Single poster from scratch
poster = pipeline.generate_single_poster(
    ai_style=MapStyle.VINTAGE,
    poster_title="Vintage Florida Surf Collection"
)

# Full collection
collection = pipeline.generate_poster_collection()

# Custom poster
custom = pipeline.generate_custom_poster(
    custom_prompt="Hand-drawn treasure map of Florida",
    poster_title="Treasure Map Surf Breaks",
    output_name="treasure_map"
)
```

## 🎯 Coastal Spacing Optimization

All AI-generated maps include:
- **15% minimum margins** around entire coastline
- **Wide coastal buffer zones** for text placement
- **Maximum white space** for label readability
- **Centered state positioning** for balanced layout
- **No conflicting text/labels** in base maps

## 🏄‍♂️ Surf Break Features

- **150+ Florida surf breaks** with coordinates
- **Smart label positioning** based on geography
- **Color-coded break types** (Beach, Reef, Point, etc.)
- **Professional typography** with shadow effects
- **Enhanced markers** (circles, stars, dots)
- **Connection lines** to surf break locations

## 📊 Usage Examples

### Example 1: Quick Poster
```bash
python ai_poster_pipeline.py
```

### Example 2: Custom Style
```python
pipeline = AIPosterPipeline()

# Generate psychedelic surf poster
poster = pipeline.generate_custom_poster(
    custom_prompt="Psychedelic tie-dye Florida map, rainbow colors, groovy patterns",
    poster_title="Florida Surf Breaks - Psychedelic Edition",
    output_name="psychedelic_surf"
)
```

### Example 3: Business Collection
```python
# Generate professional collection for business
business_styles = [MapStyle.CLASSIC, MapStyle.MINIMALIST]

collection = pipeline.generate_poster_collection(
    collection_name="Professional Florida Surf Maps",
    styles_to_generate=business_styles,
    width=2048,  # High resolution for printing
    height=2048
)
```

## 🔧 Configuration

### Map Generation Settings
- **Width/Height**: 1024x1024 (default), up to 2048x2048
- **AI Models**: flux-schnell (fast), flux-dev (quality), sdxl (stable)
- **Quality**: 95% JPEG compression
- **Guidance**: 7.5 (balanced prompt following)

### Poster Settings
- **Font Fallbacks**: Helvetica → Arial → Liberation Sans
- **Text Effects**: Shadows, backgrounds, emboss
- **Marker Styles**: Circles, stars, dots
- **Line Styles**: Solid, dashed
- **Color Coding**: 11 surf break types

## 🚨 Important Notes

### Legal & Ethical
- Respect Replicate's Terms of Service
- Consider surf-forecast.com's robots.txt and ToS
- For commercial use, verify data licensing requirements

### API Costs
- Replicate charges per generation (~$0.01-0.05 per image)
- Monitor usage in your Replicate dashboard
- Consider caching generated templates

### Performance
- AI generation: 10-30 seconds per map
- Poster overlay: 1-3 seconds
- Full pipeline: 15-45 seconds per poster

## 🧪 Testing

```bash
# Test service structure
python test_replicate_service.py

# Test with existing map
python test.py

# Test poster examples
python poster_examples.py

# Test full AI pipeline (requires API token)
python ai_poster_pipeline.py
```

## 🎉 Production Ready Features

✅ **Error Handling** - Comprehensive try/catch blocks  
✅ **Logging** - Detailed operation tracking  
✅ **Type Hints** - Full type safety  
✅ **Documentation** - Extensive docstrings  
✅ **Validation** - Input sanitization and bounds checking  
✅ **Fallbacks** - Font and style fallback options  
✅ **Optimization** - Memory efficient image processing  
✅ **Modularity** - Clean separation of concerns  

## 📈 Next Steps

1. **E-commerce Integration** - Connect to Shopify/WooCommerce
2. **Print-on-Demand** - Integrate with Printful/Printify
3. **Web Interface** - Build customer-facing UI
4. **Additional Styles** - Expand AI map style library
5. **Custom Regions** - Support for other coastal areas

---

**🏄‍♂️ Ready to create amazing Florida surf break posters with AI!** 