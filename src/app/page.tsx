"use client";

import { useState } from "react";

// Known biased terms to flag
const BIAS_TERMS: Record<string, string> = {
  "rockstar": "Gendered language - consider 'high performer'",
  "ninja": "Cultural appropriation - consider 'expert'",
  "guru": "Cultural appropriation - consider 'specialist'",
  "young": "Age discrimination - remove or rephrase",
  "energetic": "Can imply age bias - consider 'motivated'",
  "native speaker": "Can exclude qualified candidates - consider 'fluent'",
  "culture fit": "Can enable discrimination - consider 'values alignment'",
  "digital native": "Age discrimination - remove",
  "he/him": "Gendered language - use they/them",
  "she/her": "Gendered language - use they/them",
  "manpower": "Gendered language - consider 'workforce'",
  "chairman": "Gendered language - consider 'chairperson'",
  "aggressive": "Can deter women applicants - consider 'ambitious'",
  "dominant": "Can deter women applicants - consider 'confident'",
};

interface GeneratedJD {
  title: string;
  company_intro: string;
  about_role: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  benefits: string[];
  salary_range: string;
  bias_warnings: string[];
}

export default function JDGenerator() {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [location, setLocation] = useState("Remote");
  const [seniority, setSeniority] = useState("Mid-level");
  
  const [loading, setLoading] = useState(false);
  const [generatedJD, setGeneratedJD] = useState<GeneratedJD | null>(null);
  const [error, setError] = useState("");

  const generateJD = async () => {
    if (!jobTitle || !companyName) {
      setError("Please fill in at least Job Title and Company Name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          companyName,
          industry,
          keyPoints,
          location,
          seniority,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate job description");
      }

      const data = await response.json();
      
      // Check for bias terms
      const fullText = JSON.stringify(data).toLowerCase();
      const warnings: string[] = [];
      
      Object.entries(BIAS_TERMS).forEach(([term, warning]) => {
        if (fullText.includes(term.toLowerCase())) {
          warnings.push(`"${term}": ${warning}`);
        }
      });

      setGeneratedJD({ ...data, bias_warnings: warnings });
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedJD) return;
    
    const text = `
# ${generatedJD.title}

## About ${companyName}
${generatedJD.company_intro}

## About the Role
${generatedJD.about_role}

## Responsibilities
${generatedJD.responsibilities.map(r => `- ${r}`).join("\n")}

## Requirements
${generatedJD.requirements.map(r => `- ${r}`).join("\n")}

## Nice to Have
${generatedJD.nice_to_have.map(r => `- ${r}`).join("\n")}

## Benefits
${generatedJD.benefits.map(b => `- ${b}`).join("\n")}

${generatedJD.salary_range}
    `.trim();
    
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            AI Job Description
            <span className="text-blue-400"> Generator</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate professional, bias-free job descriptions in seconds.
            Powered by AI, optimized for hiring.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Job Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Acme Corp"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" className="bg-gray-800">Select industry...</option>
                  <option value="Technology" className="bg-gray-800">Technology</option>
                  <option value="Finance" className="bg-gray-800">Finance</option>
                  <option value="Healthcare" className="bg-gray-800">Healthcare</option>
                  <option value="E-commerce" className="bg-gray-800">E-commerce</option>
                  <option value="Marketing" className="bg-gray-800">Marketing</option>
                  <option value="Education" className="bg-gray-800">Education</option>
                  <option value="Professional Services" className="bg-gray-800">Professional Services</option>
                  <option value="Other" className="bg-gray-800">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Remote" className="bg-gray-800">Remote</option>
                    <option value="Hybrid" className="bg-gray-800">Hybrid</option>
                    <option value="On-site" className="bg-gray-800">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Seniority
                  </label>
                  <select
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Entry-level" className="bg-gray-800">Entry-level</option>
                    <option value="Mid-level" className="bg-gray-800">Mid-level</option>
                    <option value="Senior" className="bg-gray-800">Senior</option>
                    <option value="Lead" className="bg-gray-800">Lead</option>
                    <option value="Manager" className="bg-gray-800">Manager</option>
                    <option value="Director" className="bg-gray-800">Director</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Points (optional)
                </label>
                <textarea
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="Any specific skills, responsibilities, or requirements you want to highlight..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={generateJD}
                disabled={loading}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  "✨ Generate Job Description"
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {generatedJD ? (
              <>
                {/* Bias Warnings */}
                {generatedJD.bias_warnings.length > 0 && (
                  <div className="bg-yellow-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-3">
                      ⚠️ Bias Check Warnings
                    </h3>
                    <ul className="space-y-2 text-sm text-yellow-200">
                      {generatedJD.bias_warnings.map((warning, i) => (
                        <li key={i}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Generated JD */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">
                      {generatedJD.title}
                    </h2>
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm text-white transition-colors"
                    >
                      📋 Copy All
                    </button>
                  </div>

                  <div className="space-y-6 text-gray-300">
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">About {companyName}</h4>
                      <p className="text-sm">{generatedJD.company_intro}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">About the Role</h4>
                      <p className="text-sm">{generatedJD.about_role}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">Responsibilities</h4>
                      <ul className="text-sm space-y-1">
                        {generatedJD.responsibilities.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">Requirements</h4>
                      <ul className="text-sm space-y-1">
                        {generatedJD.requirements.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">Nice to Have</h4>
                      <ul className="text-sm space-y-1">
                        {generatedJD.nice_to_have.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">Benefits</h4>
                      <ul className="text-sm space-y-1">
                        {generatedJD.benefits.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    {generatedJD.salary_range && (
                      <div className="p-4 bg-green-500/20 rounded-lg">
                        <h4 className="text-sm font-semibold text-green-400 mb-1">💰 Salary Range</h4>
                        <p className="text-sm text-green-200">{generatedJD.salary_range}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Your job description will appear here
                </h3>
                <p className="text-gray-400">
                  Fill in the details on the left and click generate to create a professional, 
                  AI-powered job description.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Hire better, faster, fairer 🎯</p>
          <p className="mt-2">
            <a href="https://sumaqconsulting.com" className="text-blue-400 hover:underline">
              Sumaq Consulting
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
