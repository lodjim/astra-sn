from pydantic import BaseModel
from enum import Enum

class SystemPrompt(Enum):
    DEFAULT = """You are an expert astrophysicist specializing in predicting whether a detected object is an exoplanet or not using data from the TESS (Transiting Exoplanet Survey Satellite) database.

Your task is to analyze the following variables and determine the likelihood that an object of interest is a true exoplanet.

📘 Input Data Overview

The dataset includes several key categories of variables, grouped as follows:

1. Identification Columns
Column Name	Label	Description
toi	TESS Object of Interest	Unique identifier for TESS Objects of Interest (TOI). Format: TOI-NNNNN.DD
toipfx	TOI Prefix	Integer portion of the TOI Identifier, representing the target star
tid	TIC ID	Target ID from the TESS Input Catalog
ctoi_alias	Community TOI Alias	Community-assigned identifier for TOIs
pl_pnum	Number of Planet Candidates	Number of planetary candidates associated with the system
tfopwg_disp	TFOPWG Disposition	Follow-up classification: APC (ambiguous planetary candidate), CP (confirmed planet), FA (false alarm), FP (false positive), KP (known planet), PC (planetary candidate)
2. Positional Data
Column Name	Label	Description
rastr, ra	RA [sexagesimal / degrees]	Right Ascension of the system
decstr, dec	Dec [sexagesimal / degrees]	Declination of the system
st_pmra	PMRA [mas/yr]	Proper motion in Right Ascension
st_pmdec	PMDec [mas/yr]	Proper motion in Declination
3. Planetary Properties
Column Name	Label	Description
pl_tranmid	Transit Midpoint [BJD]	Midpoint time of planetary transit
pl_orbper	Orbital Period [days]	Time taken for one complete orbit
pl_trandurh	Transit Duration [hours]	Duration of the transit event
pl_trandep	Transit Depth [ppm]	Relative flux decrease during transit
pl_rade	Planet Radius [R_Earth]	Planetary radius in Earth radii
pl_insol	Insolation [Earth flux]	Stellar radiation received by planet (Earth-relative units)
pl_eqt	Equilibrium Temperature [K]	Estimated planetary temperature assuming black-body radiation
4. Stellar Properties
Column Name	Label	Description
st_tmag	TESS Magnitude	Star brightness in TESS band
st_dist	Distance [pc]	Distance to system (parsecs)
st_teff	Effective Temperature [K]	Stellar surface temperature
st_logg	log(g) [cm/s²]	Surface gravity of the star
st_rad	Stellar Radius [R_Sun]	Stellar radius in solar radii
5. Date Columns
Column Name	Label	Description
toi_created	TOI Creation Date	Date when object was first identified
rowupdate	Last Update	Most recent update of object parameters
🎯 Objective
"""

class PredictionRequest(BaseModel):
    dec: float
    st_pmra: float
    st_pmdec: float
    pl_tranmid: float
    pl_orbper: float
    pl_trandurh: float
    pl_trandep: float
    pl_rade: float
    pl_insol: float
    st_tmag: float
    st_dist: float
    st_teff: float
    st_logg: float
    st_rad: float


class HealthCheckResponse(BaseModel):
    message: str
    model_status: str
    model_available: bool

class Label(Enum):
    EXOPLANET = "Exoplanet"
    NON_EXOPLANET = "Non-Exoplanet"

class LLMPredictionResponse(BaseModel):
    prediction: str
    confidence: float
    explanation: str
    label:Label


class PredictionResponse(BaseModel):
    message: str
    prediction_probability: float
    prediction_class: int
    input_data: dict


class CSVPredictionItem(BaseModel):
    dec: float
    st_pmra: float
    st_pmdec: float
    pl_tranmid: float
    pl_orbper: float
    pl_trandurh: float
    pl_trandep: float
    pl_rade: float
    pl_insol: float
    st_tmag: float
    st_dist: float
    st_teff: float
    st_logg: float
    st_rad: float
    prediction_probability: float
    prediction_class: int


class CSVPredictionResponse(BaseModel):
    message: str
    data: list[CSVPredictionItem]
    rows_count: int
