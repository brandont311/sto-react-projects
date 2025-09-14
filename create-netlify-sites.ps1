# Netlify Site Creation Script for STO React Projects
# Run this script to create all 19 Netlify sites

$projects = @(
    "amplitudegeodeticapp",
    "cancer-entropy-detector", 
    "cellular-entropy-dashboard",
    "curvatureframeworkapp",
    "gwds-gls-demos",
    "harmonictimefieldsimulator",
    "hybrid-data-storage-demo",
    "luck-training-demo",
    "prime-trade-demo",
    "protein-folding-accelerator",
    "psionicfieldsimulator",
    "qsp-energy-system",
    "sapmchsimulator",
    "stonavierstokes",
    "stoqconsciousnesstuner",
    "stounifiedfieldapp",
    "yangmillsmassgapapp",
    "z-factor-energy-core",
    "zfactor-energy-demo"
)

Write-Host "🚀 Creating 19 Netlify sites for STO React Projects..." -ForegroundColor Cyan
Write-Host ""

foreach ($project in $projects) {
    Write-Host "Creating site for: $project" -ForegroundColor Yellow
    
    # Navigate to project directory
    Set-Location $project
    
    # Create site with auto-generated name
    netlify sites:create --name "$project-brandont311"
    
    # Link the site to this directory
    netlify link
    
    # Set build settings
    netlify build:settings --base . --cmd "npm run build" --dir "dist"
    
    # Go back to root
    Set-Location ..
    
    Write-Host "✅ $project site created!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🎉 All 19 sites created successfully!" -ForegroundColor Green
Write-Host "Visit https://app.netlify.com to see your sites" -ForegroundColor Cyan
