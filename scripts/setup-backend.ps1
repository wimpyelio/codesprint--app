Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Push-Location backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Pop-Location
