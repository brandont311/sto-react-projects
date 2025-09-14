# Netlify Bulk Deployment Script for STO React Projects
# This script creates 19 Netlify sites from the monorepo

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
Write-Host "Repository: brandont311/sto-react-projects" -ForegroundColor Green

$createdSites = @()

foreach ($project in $projects) {
    Write-Host "`n===== Creating site for: $project =====" -ForegroundColor Yellow
    
    try {
        # Create site with a clean name
        $siteName = $project -replace "app$", "" -replace "simulator$", "sim" -replace "demo$", ""
        $siteName = "sto-$siteName"
        
        # Navigate to project directory
        Set-Location $project
        
        # Create Netlify site
        $output = netlify sites:create --name $siteName --with-ci 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Site created: $siteName" -ForegroundColor Green
            $createdSites += "$project -> $siteName"
        } else {
            Write-Host "⚠️ Issue with $project - you may need to configure manually" -ForegroundColor Yellow
            Write-Host $output
        }
        
        # Return to root directory
        Set-Location ..
        
        Start-Sleep -Seconds 2
    }
    catch {
        Write-Host "❌ Error creating site for $project`: $_" -ForegroundColor Red
        Set-Location ..
    }
}

Write-Host "`n🎉 Netlify site creation process complete!" -ForegroundColor Green
Write-Host "`n📋 Created Sites:" -ForegroundColor Cyan
foreach ($site in $createdSites) {
    Write-Host "  • $site" -ForegroundColor White
}

Write-Host "`n🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to app.netlify.com to configure GitHub integration for each site" -ForegroundColor White
Write-Host "2. For each site, set:" -ForegroundColor White
Write-Host "   - Repository: brandont311/sto-react-projects" -ForegroundColor Gray
Write-Host "   - Base directory: [project-folder]/" -ForegroundColor Gray
Write-Host "   - Build command: npm run build" -ForegroundColor Gray
Write-Host "   - Publish directory: [project-folder]/dist" -ForegroundColor Gray
Write-Host "3. Test with: git push origin main" -ForegroundColor White
