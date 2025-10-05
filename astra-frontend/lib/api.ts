// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Type definitions based on OpenAPI spec
export interface PredictionRequest {
  dec: number;
  st_pmra: number;
  st_pmdec: number;
  pl_tranmid: number;
  pl_orbper: number;
  pl_trandurh: number;
  pl_trandep: number;
  pl_rade: number;
  pl_insol: number;
  st_tmag: number;
  st_dist: number;
  st_teff: number;
  st_logg: number;
  st_rad: number;
}

// Sample test data from TESS Object of Interest (TOI) catalog for testing
export interface SampleRecord {
  name: string;
  description: string;
  data: PredictionRequest;
}

export const SAMPLE_TEST_RECORDS: SampleRecord[] = [
  {
    name: "TOI-1000.01 (FP)",
    description: "False Positive - Hot Jupiter candidate",
    data: {
      dec: -12.6959600,
      st_pmra: -5.9640000,
      st_pmdec: -0.0760000,
      pl_tranmid: 2459229.6300460,
      pl_orbper: 2.1713484,
      pl_trandurh: 2.0172196,
      pl_trandep: 656.8860989,
      pl_rade: 5.8181633,
      pl_insol: 22601.9485814,
      st_tmag: 9.6040000,
      st_dist: 485.7350000,
      st_teff: 10249.0000000,
      st_logg: 4.1900000,
      st_rad: 2.1698600,
    }
  },
  {
    name: "TOI-1001.01 (PC)",
    description: "Planet Candidate - Super Earth",
    data: {
      dec: -5.5138520,
      st_pmra: -4.9560000,
      st_pmdec: -15.5550000,
      pl_tranmid: 2459987.9488730,
      pl_orbper: 1.9316462,
      pl_trandurh: 3.1660000,
      pl_trandep: 1286.0000000,
      pl_rade: 11.2154000,
      pl_insol: 44464.5000000,
      st_tmag: 9.4234400,
      st_dist: 295.8620000,
      st_teff: 7070.0000000,
      st_logg: 4.0300000,
      st_rad: 2.0100000,
    }
  },
  {
    name: "TOI-1007.01 (PC)",
    description: "Planet Candidate - Neptune-sized",
    data: {
      dec: -4.4633590,
      st_pmra: 0.3570000,
      st_pmdec: 3.3990000,
      pl_tranmid: 2459247.9306950,
      pl_orbper: 6.9989206,
      pl_trandurh: 3.9530000,
      pl_trandep: 2840.0000000,
      pl_rade: 14.7752000,
      pl_insol: 448.7440000,
      st_tmag: 8.8775900,
      st_dist: 283.2910000,
      st_teff: 6596.0000000,
      st_logg: 3.7100000,
      st_rad: 2.7000000,
    }
  },
  {
    name: "TOI-101.01 (KP)",
    description: "Known Planet - Confirmed Exoplanet",
    data: {
      dec: -55.8718630,
      st_pmra: 12.6410000,
      st_pmdec: -16.0110000,
      pl_tranmid: 2458326.0091170,
      pl_orbper: 1.4303699,
      pl_trandurh: 1.6165994,
      pl_trandep: 18960.7122944,
      pl_rade: 13.1874503,
      pl_insol: 1281.2408254,
      st_tmag: 12.4069000,
      st_dist: 375.3100000,
      st_teff: 5600.0000000,
      st_logg: 4.4885100,
      st_rad: 0.8907740,
    }
  },
  {
    name: "TOI-102.01 (KP)",
    description: "Known Planet - Earth-like candidate",
    data: {
      dec: -63.9883290,
      st_pmra: -15.6410000,
      st_pmdec: 26.0460000,
      pl_tranmid: 2460187.9165710,
      pl_orbper: 4.4119378,
      pl_trandurh: 3.6500000,
      pl_trandep: 15062.0000000,
      pl_rade: 15.4706000,
      pl_insol: 653.2520000,
      st_tmag: 9.7109000,
      st_dist: 175.6310000,
      st_teff: 6280.0000000,
      st_logg: 4.3209200,
      st_rad: 1.2100000,
    }
  },
  {
    name: "TOI-1011.01 (PC)",
    description: "Planet Candidate - Small rocky planet",
    data: {
      dec: -32.8419990,
      st_pmra: 145.1020000,
      st_pmdec: -134.9010000,
      pl_tranmid: 2459984.6277680,
      pl_orbper: 2.4704981,
      pl_trandurh: 2.1910000,
      pl_trandep: 250.0000000,
      pl_rade: 1.4465600,
      pl_insol: 575.5970000,
      st_tmag: 8.2388000,
      st_dist: 52.6200000,
      st_teff: 5413.7000000,
      st_logg: 4.4600000,
      st_rad: 0.9400000,
    }
  },
  {
    name: "TOI-1739.01 (CP)",
    description: "Confirmed Planet - Super-Earth around M-dwarf",
    data: {
      dec: 83.2586590,
      st_pmra: -132.9150000,
      st_pmdec: 107.8270000,
      pl_tranmid: 2460661.4350230,
      pl_orbper: 8.3033493,
      pl_trandurh: 1.7050000,
      pl_trandep: 571.0000000,
      pl_rade: 1.9584400,
      pl_insol: 36.5628000,
      st_tmag: 9.8120000,
      st_dist: 70.9819000,
      st_teff: 4814.0000000,
      st_logg: 4.5451900,
      st_rad: 0.7800000,
    }
  },
  {
    name: "TOI-174.01 (CP)",
    description: "Confirmed Planet - Super-Earth in multi-planet system",
    data: {
      dec: -62.7672670,
      st_pmra: -102.5710000,
      st_pmdec: -43.9170000,
      pl_tranmid: 2460180.3781050,
      pl_orbper: 17.6671687,
      pl_trandurh: 2.5250000,
      pl_trandep: 854.0000000,
      pl_rade: 1.8704200,
      pl_insol: 7.6088400,
      st_tmag: 8.7513000,
      st_dist: 39.0341000,
      st_teff: 4813.0000000,
      st_logg: 4.3800000,
      st_rad: 0.6900000,
    }
  },
  {
    name: "TOI-174.02 (CP)",
    description: "Confirmed Planet - Earth-sized planet in system",
    data: {
      dec: -62.7672670,
      st_pmra: -102.5710000,
      st_pmdec: -43.9170000,
      pl_tranmid: 2460157.9513640,
      pl_orbper: 29.7975205,
      pl_trandurh: 2.7820000,
      pl_trandep: 671.0000000,
      pl_rade: 1.6098200,
      pl_insol: 3.2713000,
      st_tmag: 8.7513000,
      st_dist: 39.0341000,
      st_teff: 4813.0000000,
      st_logg: 4.3800000,
      st_rad: 0.6900000,
    }
  },
  {
    name: "TOI-174.03 (CP)",
    description: "Confirmed Planet - Compact sub-Neptune",
    data: {
      dec: -62.7672670,
      st_pmra: -102.5710000,
      st_pmdec: -43.9170000,
      pl_tranmid: 2460184.4142440,
      pl_orbper: 12.1623316,
      pl_trandurh: 2.6140000,
      pl_trandep: 317.0000000,
      pl_rade: 1.1564300,
      pl_insol: 27.5458000,
      st_tmag: 8.7513000,
      st_dist: 39.0341000,
      st_teff: 4813.0000000,
      st_logg: 4.3800000,
      st_rad: 0.6900000,
    }
  },
  {
    name: "TOI-174.04 (CP)",
    description: "Confirmed Planet - Hot Earth-sized planet",
    data: {
      dec: -62.7672670,
      st_pmra: -102.5710000,
      st_pmdec: -43.9170000,
      pl_tranmid: 2460203.0179280,
      pl_orbper: 3.9766833,
      pl_trandurh: 1.8590000,
      pl_trandep: 142.0000000,
      pl_rade: 0.7575880,
      pl_insol: 89.0886000,
      st_tmag: 8.7513000,
      st_dist: 39.0341000,
      st_teff: 4813.0000000,
      st_logg: 4.3800000,
      st_rad: 0.6900000,
    }
  },
  {
    name: "TOI-174.05 (CP)",
    description: "Confirmed Planet - Earth-sized in habitable zone edge",
    data: {
      dec: -62.7672670,
      st_pmra: -102.5710000,
      st_pmdec: -43.9170000,
      pl_tranmid: 2460197.0387390,
      pl_orbper: 7.9076222,
      pl_trandurh: 2.6110000,
      pl_trandep: 217.0000000,
      pl_rade: 0.9698190,
      pl_insol: 44.8107000,
      st_tmag: 8.7513000,
      st_dist: 39.0341000,
      st_teff: 4813.0000000,
      st_logg: 4.3800000,
      st_rad: 0.6900000,
    }
  },
];

// Default sample data (first record for backward compatibility)
export const DEFAULT_PREDICTION_DATA: PredictionRequest = SAMPLE_TEST_RECORDS[0].data;

export interface PredictionResponse {
  message: string;
  prediction_probability: number;
  prediction_class: number;
  input_data: Record<string, any>;
}

export interface LLMPredictionResponse {
  label: string;  // Indicates if it's an exoplanet or not
  confidence: number;  // Confidence of the label prediction
  explanation: string;
}

export interface CSVPredictionItem {
  dec: number;
  st_pmra: number;
  st_pmdec: number;
  pl_tranmid: number;
  pl_orbper: number;
  pl_trandurh: number;
  pl_trandep: number;
  pl_rade: number;
  pl_insol: number;
  st_tmag: number;
  st_dist: number;
  st_teff: number;
  st_logg: number;
  st_rad: number;
  prediction_probability: number;
  prediction_class: number;
}

export interface CSVPredictionResponse {
  message: string;
  data: CSVPredictionItem[];
  rows_count: number;
}

export interface HealthCheckResponse {
  message: string;
  model_status: string;
  model_available: boolean;
}

// API Client Class
class AstraAPIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${this.baseURL}/health-check`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Quick prediction using ML model
   */
  async predict(data: PredictionRequest): Promise<PredictionResponse> {
    const response = await fetch(`${this.baseURL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Prediction failed');
    }

    return response.json();
  }

  /**
   * Deep prediction with LLM analysis
   */
  async llmPredict(data: PredictionRequest): Promise<LLMPredictionResponse> {
    const response = await fetch(`${this.baseURL}/llm-predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'LLM prediction failed');
    }

    return response.json();
  }

  /**
   * CSV file upload for batch predictions
   */
  async predictCSV(file: File): Promise<CSVPredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/predict-csv`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'CSV prediction failed');
    }

    return response.json();
  }
}

// Export singleton instance
export const apiClient = new AstraAPIClient(API_BASE_URL);
