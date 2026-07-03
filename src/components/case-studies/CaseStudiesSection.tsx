import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import { useLanguage } from "@/contexts/LanguageContext";
import EditorialSection from "@/components/editorial/EditorialSection";
import EditorialChapterHeader from "@/components/editorial/EditorialChapterHeader";
import EditorialPullQuote from "@/components/editorial/EditorialPullQuote";
import EditorialCTA from "@/components/editorial/EditorialCTA";
import EditorialPlate from "@/components/editorial/EditorialPlate";
import { editorialTone, editorialType, type EditorialTone } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";

const TONE_ROTATION: EditorialTone[] = ["warm", "night", "clay", "paper"];

const CaseStudiesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t("page_titles.case_studies");
  }, [t]);

  const categories = [
    { id: "all", label: t("case_studies.all_categories") },
    { id: "interactive-storytelling", label: t("case_studies.categories.interactive_storytelling") },
    { id: "educational-tech", label: t("case_studies.categories.educational_tech") },
    { id: "methodology", label: t("case_studies.categories.methodology") },
  ];

  const filteredStudies =
    selectedCategory === "all"
      ? caseStudies
      : caseStudies.filter((study) => study.category === selectedCategory);

  const selectedStudyData = selectedStudy
    ? caseStudies.find((study) => study.id === selectedStudy)
    : null;

  if (selectedStudy && selectedStudyData) {
    const tone: EditorialTone = "warm";
    const styles = editorialTone[tone];
    return (
      <main className="bg-background text-foreground">
        <EditorialSection tone={tone} className="pt-14 pb-10">
          <button
            onClick={() => setSelectedStudy(null)}
            className={cn(editorialType.cta, "inline-flex items-center gap-2 opacity-70 hover:opacity-100")}
          >
            <ArrowLeft className="w-4 h-4" /> {t("case_studies.back_to_studies")}
          </button>
        </EditorialSection>

        <EditorialSection tone={tone} className="pt-4">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-7 space-y-8">
              <p className={cn(editorialType.eyebrow, styles.kicker)}>
                Field notes · {t(`case_studies.categories.${selectedStudyData.category.replace("-", "_")}`)}
              </p>
              <h1 className={cn(editorialType.serif, "text-5xl md:text-7xl leading-[0.98] tracking-tight")}>
                {t(selectedStudyData.title)}
              </h1>
              <p className="text-xl opacity-80 max-w-2xl leading-snug">
                {t(selectedStudyData.description)}
              </p>

              <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-current/10">
                <div>
                  <p className={cn(editorialType.caption, "mb-2")}>{t("case_studies.role")}</p>
                  <p className="text-[15px] leading-relaxed opacity-90">{t(selectedStudyData.role)}</p>
                </div>
                <div>
                  <p className={cn(editorialType.caption, "mb-2")}>{t("case_studies.methods")}</p>
                  <ul className="text-[15px] leading-relaxed opacity-90 space-y-1">
                    {selectedStudyData.methods.map((m, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="opacity-50">→</span>
                        <span>{t(m)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <p className={cn(editorialType.caption, "mb-2")}>{t("case_studies.results")}</p>
                <p className="text-[15px] leading-relaxed opacity-90">{t(selectedStudyData.results)}</p>
              </div>

              {selectedStudyData.impact && (
                <EditorialPullQuote tone={tone}>{t(selectedStudyData.impact)}</EditorialPullQuote>
              )}

              {selectedStudyData.awards && selectedStudyData.awards.length > 0 && (
                <div>
                  <p className={cn(editorialType.caption, "mb-2")}>{t("case_studies.awards")}</p>
                  <ul className="text-[15px] leading-relaxed opacity-90 space-y-1">
                    {selectedStudyData.awards.map((a, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="opacity-50">✦</span>
                        <span>{t(a)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedStudyData.technologies && selectedStudyData.technologies.length > 0 && (
                <div>
                  <p className={cn(editorialType.caption, "mb-3")}>{t("case_studies.technologies")}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudyData.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {t(tech)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedStudyData.image && (
              <div className="md:col-span-5">
                <EditorialPlate
                  image={`https://images.unsplash.com/${selectedStudyData.image}?auto=format&fit=crop&w=800&q=80`}
                  alt={t(selectedStudyData.title)}
                  caption={t(selectedStudyData.title)}
                />
              </div>
            )}
          </div>
        </EditorialSection>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <EditorialSection tone="warm" className="pt-16 md:pt-24 pb-16">
        <div className="max-w-4xl">
          <p className={cn(editorialType.eyebrow, editorialTone.warm.kicker)}>
            Volume I · Field notes
          </p>
          <h1 className={cn(editorialType.serif, "text-5xl md:text-7xl leading-[0.98] tracking-tight mt-6")}>
            {t("case_studies.page_title")}
          </h1>
          <p className={cn(editorialType.serif, "italic text-2xl md:text-3xl mt-6 opacity-80")}>
            {t("case_studies.subtitle")}
          </p>
        </div>
      </EditorialSection>

      {/* Filter */}
      <div className="bg-background border-y border-border">
        <div className="container max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <p className={editorialType.caption}>Filter</p>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder={t("case_studies.filter_by_category")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* One chapter per case study */}
      {filteredStudies.map((study, i) => {
        const tone = TONE_ROTATION[i % TONE_ROTATION.length];
        const styles = editorialTone[tone];
        const numeral = String(i + 1).padStart(2, "0");
        const reverse = i % 2 === 1;
        return (
          <section
            key={study.id}
            id={study.id}
            className={cn("py-20 md:py-28 px-6 relative", styles.section)}
          >
            <div className="container max-w-7xl mx-auto">
              <EditorialChapterHeader
                numeral={numeral}
                kicker={t(`case_studies.categories.${study.category.replace("-", "_")}`)}
                tone={tone}
              />
              <div
                className={cn(
                  "grid md:grid-cols-12 gap-10 md:gap-16 items-start",
                  reverse && "md:[&>*:first-child]:order-2",
                )}
              >
                <div className="md:col-span-7 space-y-6">
                  <h2 className={cn(editorialType.serif, "text-4xl md:text-5xl leading-[1.05] tracking-tight")}>
                    {t(study.title)}
                  </h2>
                  <p className="text-lg opacity-85 leading-relaxed max-w-2xl">
                    {t(study.description)}
                  </p>
                  {study.technologies && study.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {study.technologies.slice(0, 5).map((tech, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            editorialType.caption,
                            "px-3 py-1 rounded-full border border-current/25",
                          )}
                        >
                          {t(tech)}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="pt-3">
                    <button
                      onClick={() => setSelectedStudy(study.id)}
                      className={cn(
                        "inline-flex items-center gap-2 px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5",
                        editorialType.cta,
                        styles.ctaPrimary,
                      )}
                    >
                      {t("case_studies.view_details")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {study.image && (
                  <div className="md:col-span-5">
                    <EditorialPlate
                      numeral={numeral}
                      image={`https://images.unsplash.com/${study.image}?auto=format&fit=crop&w=800&q=80`}
                      alt={t(study.title)}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* Closing */}
      <EditorialSection tone="night">
        <div className="max-w-3xl">
          <p className={cn(editorialType.eyebrow, editorialTone.night.kicker)}>Next</p>
          <h2 className={cn(editorialType.serif, "text-4xl md:text-6xl leading-[1.02] tracking-tight mt-4")}>
            Bring your own <em className="italic font-light">field</em> into the practice.
          </h2>
          <div className="mt-8">
            <EditorialCTA
              tone="night"
              href="mailto:jbelisle@helloarchitekt.com?subject=Working%20together%20—%20Paracosm"
            >
              Start a conversation
            </EditorialCTA>
          </div>
        </div>
      </EditorialSection>
    </main>
  );
};

export default CaseStudiesSection;
