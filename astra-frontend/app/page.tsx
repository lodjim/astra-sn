"use client";

import { useState } from "react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Zap, Upload, Database } from "lucide-react";

import { apiClient, PredictionRequest, PredictionResponse, LLMPredictionResponse, CSVPredictionResponse, SAMPLE_TEST_RECORDS } from "@/lib/api";
import ExoplanetVisualization from "@/components/ui/exoplanet-visualization";

// Define the exoplanet data structure based on API requirements
interface ExoplanetData {
  dec: string;          // Declination [degrees]
  st_pmra: string;      // PMRA [mas/yr] - Angular change in right ascension
  st_pmdec: string;     // PMDec [mas/yr] - Angular change in declination
  pl_tranmid: string;   // Planet Transit Midpoint [BJD]
  pl_orbper: string;    // Planet Orbital Period [days]
  pl_trandurh: string;  // Planet Transit Duration [hours]
  pl_trandep: string;   // Planet Transit Depth [ppm]
  pl_rade: string;      // Planet Radius [R_Earth]
  pl_insol: string;     // Planet Insolation [Earth flux]
  st_tmag: string;      // TESS Magnitude
  st_dist: string;      // Stellar Distance [pc]
  st_teff: string;      // Stellar Effective Temperature [K]
  st_logg: string;      // Stellar log(g) [cm/s**2]
  st_rad: string;       // Stellar Radius [R_Sun]
}

const initialData: ExoplanetData = {
  dec: "",
  st_pmra: "",
  st_pmdec: "",
  pl_tranmid: "",
  pl_orbper: "",
  pl_trandurh: "",
  pl_trandep: "",
  pl_rade: "",
  pl_insol: "",
  st_tmag: "",
  st_dist: "",
  st_teff: "",
  st_logg: "",
  st_rad: "",
};

const fieldLabels: Record<keyof ExoplanetData, { label: string; description: string; unit: string }> = {
  dec: { label: "Declination", description: "Declination coordinate", unit: "degrees" },
  st_pmra: { label: "PMRA", description: "Angular change in right ascension", unit: "mas/yr" },
  st_pmdec: { label: "PMDec", description: "Angular change in declination", unit: "mas/yr" },
  pl_tranmid: { label: "Transit Midpoint", description: "Planet transit midpoint", unit: "BJD" },
  pl_orbper: { label: "Orbital Period", description: "Time for complete orbit", unit: "days" },
  pl_trandurh: { label: "Transit Duration", description: "Length of transit", unit: "hours" },
  pl_trandep: { label: "Transit Depth", description: "Relative flux decrement", unit: "ppm" },
  pl_rade: { label: "Planet Radius", description: "Radius of the planet", unit: "R⊕" },
  pl_insol: { label: "Insolation", description: "Stellar radiation received", unit: "Earth flux" },
  st_tmag: { label: "TESS Magnitude", description: "Brightness in TESS-band", unit: "mag" },
  st_dist: { label: "Stellar Distance", description: "Distance to the star", unit: "pc" },
  st_teff: { label: "Stellar Temp", description: "Effective temperature", unit: "K" },
  st_logg: { label: "Stellar log(g)", description: "Gravitational acceleration", unit: "cm/s²" },
  st_rad: { label: "Stellar Radius", description: "Radius of the star", unit: "R☉" },
};

export default function ExoplanetDiscovery() {
  const [formData, setFormData] = useState<ExoplanetData>(initialData);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [csvResults, setCsvResults] = useState<CSVPredictionResponse | null>(null);
  const [predictionData, setPredictionData] = useState<{
    prediction_class: number;
    confidence: number;
    inputData: PredictionRequest;
  } | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setError(null);
      setCsvResults(null);
      
      // Automatically process CSV file
      setIsLoading(true);
      try {
        const response = await apiClient.predictCSV(file);
        setCsvResults(response);
        setResult(`Successfully processed ${response.rows_count} rows from CSV file.`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process CSV file');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field: keyof ExoplanetData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const loadSampleData = (index: number) => {
    if (index >= 0 && index < SAMPLE_TEST_RECORDS.length) {
      const sample = SAMPLE_TEST_RECORDS[index].data;
      setFormData({
        dec: sample.dec.toString(),
        st_pmra: sample.st_pmra.toString(),
        st_pmdec: sample.st_pmdec.toString(),
        pl_tranmid: sample.pl_tranmid.toString(),
        pl_orbper: sample.pl_orbper.toString(),
        pl_trandurh: sample.pl_trandurh.toString(),
        pl_trandep: sample.pl_trandep.toString(),
        pl_rade: sample.pl_rade.toString(),
        pl_insol: sample.pl_insol.toString(),
        st_tmag: sample.st_tmag.toString(),
        st_dist: sample.st_dist.toString(),
        st_teff: sample.st_teff.toString(),
        st_logg: sample.st_logg.toString(),
        st_rad: sample.st_rad.toString(),
      });
      setError(null);
      setResult(null);
    }
  };

  const validateFormData = (): boolean => {
    // Check if all fields are filled
    for (const [key, value] of Object.entries(formData)) {
      if (value === "" || value === null || value === undefined) {
        setError(`Please fill in all fields. Missing: ${fieldLabels[key as keyof ExoplanetData].label}`);
        return false;
      }
    }
    return true;
  };

  const convertFormDataToRequest = (): PredictionRequest => {
    return {
      dec: parseFloat(formData.dec),
      st_pmra: parseFloat(formData.st_pmra),
      st_pmdec: parseFloat(formData.st_pmdec),
      pl_tranmid: parseFloat(formData.pl_tranmid),
      pl_orbper: parseFloat(formData.pl_orbper),
      pl_trandurh: parseFloat(formData.pl_trandurh),
      pl_trandep: parseFloat(formData.pl_trandep),
      pl_rade: parseFloat(formData.pl_rade),
      pl_insol: parseFloat(formData.pl_insol),
      st_tmag: parseFloat(formData.st_tmag),
      st_dist: parseFloat(formData.st_dist),
      st_teff: parseFloat(formData.st_teff),
      st_logg: parseFloat(formData.st_logg),
      st_rad: parseFloat(formData.st_rad),
    };
  };

  const handleQuickPrediction = async () => {
    setError(null);
    setResult(null);
    setCsvResults(null);
    setPredictionData(null);
    
    if (!validateFormData()) {
      return;
    }

    setIsLoading(true);
    try {
      const requestData = convertFormDataToRequest();
      const response = await apiClient.predict(requestData);
      
      const confidencePercent = (response.prediction_probability * 100).toFixed(1);
      const predictionText = response.prediction_class === 1 ? "Exoplanet detected" : "Not an exoplanet";
      
      setResult(
        `Quick Prediction: ${predictionText}! Confidence: ${confidencePercent}%\n\nPrediction Class: ${response.prediction_class}\nMessage: ${response.message}`
      );

      // Store prediction data for visualization
      setPredictionData({
        prediction_class: response.prediction_class,
        confidence: response.prediction_probability,
        inputData: requestData,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeepPrediction = async () => {
    setError(null);
    setResult(null);
    setCsvResults(null);
    setPredictionData(null);
    
    if (!validateFormData()) {
      return;
    }

    setIsLoading(true);
    try {
      const requestData = convertFormDataToRequest();
      const response = await apiClient.llmPredict(requestData);
      
      const confidencePercent = (response.confidence * 100).toFixed(1);
      
      setResult(
        `Deep Prediction: ${response.label}\n\nConfidence: ${confidencePercent}%\n\nLLM Analysis:\n${response.explanation}`
      );

      // Store prediction data for visualization
      // For LLM prediction, determine class from the label string
      // Check for "non-" prefix or "not" to avoid false positives with "Non-Exoplanet"
      const labelLower = response.label.toLowerCase();
      const predictionClass = (labelLower.includes('exoplanet') && !labelLower.includes('non-') && !labelLower.includes('not')) ? 1 : 0;
      setPredictionData({
        prediction_class: predictionClass,
        confidence: response.confidence,
        inputData: requestData,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'LLM prediction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundBeams className="absolute inset-0 z-0" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroHighlight containerClassName="h-auto py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Automatic Discovery of{" "}
              <Highlight className="text-foreground">Exoplanets</Highlight>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-6">
              Detect exoplanets based on machine learning using tabular data from the TESS
              (Transiting Exoplanet Survey Satellite) mission. Upload CSV data or enter
              parameters manually to analyze potential exoplanet candidates.
            </p>
            <div className="flex gap-4 justify-center mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>TESS TOI Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>ML Powered</span>
              </div>
            </div>
          </div>
        </HeroHighlight>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto mt-8 space-y-6">
          <Card className="backdrop-blur-sm bg-card/80 border-2">
            <div className="p-6 space-y-6">
              <div>
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl">Input Method</CardTitle>
                  <CardDescription>
                    Choose how you want to provide your exoplanet data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="csv" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="csv" className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        CSV Upload
                      </TabsTrigger>
                      <TabsTrigger value="manual" className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Manual Input
                      </TabsTrigger>
                    </TabsList>

                    {/* CSV Upload Tab */}
                    <TabsContent value="csv" className="mt-6">
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium mb-2">Required CSV columns:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-xs bg-muted/50 p-4 rounded-lg">
                            {Object.keys(fieldLabels).map((key) => (
                              <span key={key} className="text-foreground/80">
                                {key}
                              </span>
                            ))}
                          </div>
                        </div>
                        <FileUpload onChange={handleFileUpload} />
                        {uploadedFile && (
                          <div className="text-sm text-green-600 dark:text-green-400">
                            ✓ File uploaded: {uploadedFile.name}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Manual Input Tab */}
                    <TabsContent value="manual" className="mt-6">
                      {/* Sample Data Selector */}
                      <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                        <Label htmlFor="sampleSelect" className="text-sm font-medium mb-2 block">
                          Load Sample Test Data
                        </Label>
                        <div className="flex flex-col gap-2">
                          <select
                            id="sampleSelect"
                            onChange={(e) => {
                              const index = parseInt(e.target.value);
                              if (!isNaN(index)) {
                                loadSampleData(index);
                              }
                            }}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              -- Select a sample record --
                            </option>
                            {SAMPLE_TEST_RECORDS.map((record, index) => (
                              <option key={index} value={index}>
                                {record.name} - {record.description}
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-muted-foreground">
                            Choose a pre-filled TESS TOI record to quickly test the prediction models
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto p-2">
                        {(Object.keys(fieldLabels) as Array<keyof ExoplanetData>).map((field) => (
                          <div key={field} className="space-y-2">
                            <Label htmlFor={field} className="text-sm font-medium">
                              {fieldLabels[field].label}
                              <span className="text-xs text-muted-foreground ml-2">
                                ({fieldLabels[field].unit})
                              </span>
                            </Label>
                            <Input
                              id={field}
                              type="number"
                              step="any"
                              placeholder={fieldLabels[field].description}
                              value={formData[field]}
                              onChange={(e) => handleInputChange(field, e.target.value)}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </div>

              {/* Prediction Buttons */}
              <div className="pt-6 border-t border-border">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2">Run Prediction</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose between fast approximation or deep analysis
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleQuickPrediction}
                    disabled={isLoading}
                    className="h-auto py-6 flex flex-col items-center gap-2"
                    variant="outline"
                  >
                    <div>
                      <div className="font-bold">Quick Prediction</div>
                      <div className="text-xs font-normal text-muted-foreground">
                        Fast but less accurate
                      </div>
                    </div>
                  </Button>
                  <Button
                    onClick={handleDeepPrediction}
                    disabled={isLoading}
                    className="h-auto py-6 flex flex-col items-center gap-2"
                  >
                    <div>
                      <div className="font-bold">Deep Prediction</div>
                      <div className="text-xs font-normal">ML Model + LLM Analysis</div>
                    </div>
                  </Button>
                </div>

                {isLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-sm text-muted-foreground">Processing your data...</p>
                  </div>
                )}

                {error && (
                  <div className="mt-6 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 text-destructive">Error</h3>
                    <p className="text-sm leading-relaxed">{error}</p>
                  </div>
                )}

                {result && !error && (
                  <div className="mt-6 p-6 bg-primary/10 border border-primary/20 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 text-primary">Results</h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
                  </div>
                )}

                {csvResults && !error && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h3 className="font-bold text-lg mb-2 text-green-600 dark:text-green-400">
                        CSV Processing Complete
                      </h3>
                      <p className="text-sm">
                        Processed {csvResults.rows_count} row(s) successfully
                      </p>
                    </div>
                    
                    <div className="max-h-96 overflow-auto border rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-muted sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left">#</th>
                            <th className="px-4 py-2 text-left">Prediction</th>
                            <th className="px-4 py-2 text-left">Confidence</th>
                            <th className="px-4 py-2 text-left">Class</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvResults.data.map((item, idx) => (
                            <tr key={idx} className="border-t hover:bg-muted/50">
                              <td className="px-4 py-2">{idx + 1}</td>
                              <td className="px-4 py-2">
                                {item.prediction_class === 1 ? (
                                  <span className="text-green-600 dark:text-green-400">Exoplanet</span>
                                ) : (
                                  <span className="text-red-600 dark:text-red-400">Not Exoplanet</span>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {(item.prediction_probability * 100).toFixed(2)}%
                              </td>
                              <td className="px-4 py-2">{item.prediction_class}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3D Visualization for Exoplanet Detection */}
                {predictionData && predictionData.prediction_class === 1 && !error && (
                  <div className="mt-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-xl text-primary">3D System Visualization</h3>
                      <p className="text-sm text-muted-foreground">
                        Interactive 3D model of the detected exoplanet system
                      </p>
                    </div>
                    <ExoplanetVisualization
                      data={{
                        st_rad: predictionData.inputData.st_rad,
                        st_tmag: predictionData.inputData.st_tmag,
                        pl_rade: predictionData.inputData.pl_rade,
                        pl_orbper: predictionData.inputData.pl_orbper,
                        st_teff: predictionData.inputData.st_teff,
                      }}
                      predictionClass={predictionData.prediction_class}
                      confidence={predictionData.confidence}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Information Card */}
          <Card className="backdrop-blur-sm bg-card/80 border-2">
            <CardHeader>
              <CardTitle className="text-lg">About the Data</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                This tool uses data from the{" "}
                <a
                  href="https://exoplanetarchive.ipac.caltech.edu/docs/API_TOI_columns.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  TESS Objects of Interest (TOI)
                </a>{" "}
                table, which lists parameters for objects identified by the Transiting Exoplanet
                Survey Satellite mission.
              </p>
              <p>
                The machine learning model analyzes stellar and planetary parameters to determine
                the likelihood of exoplanet candidates being confirmed planets versus false
                positives.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
