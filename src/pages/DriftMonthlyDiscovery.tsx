import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ExternalLink, BookOpen, Play } from "lucide-react";
import Footer from "@/components/Footer";
import {
  driftMonthlyDiscoveries,
  getDiscoveryByYearMonth,
  getMonthName,
  axisColors,
  axisLabels,
} from "@/data/driftMonthlyDiscoveries";

const DriftMonthlyDiscovery = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();

  const y = parseInt(year || "0");
  const m = parseInt(month || "0");
  const entry = getDiscoveryByYearMonth(y, m);

  const currentIndex = driftMonthlyDiscoveries.findIndex(d => d.year === y && d.month === m);
  const prev = currentIndex > 0 ? driftMonthlyDiscoveries[currentIndex - 1] : null;
  const next = currentIndex < driftMonthlyDiscoveries.length - 1 ? driftMonthlyDiscoveries[currentIndex + 1] : null;

  if (!entry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Month not found</h1>
          <Link to="/drift">
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to Drift</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Header */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <Link to="/drift" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Drift
          </Link>

          <div className="text-center space-y-4 mb-4">
            <Badge variant="outline" className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              Monthly Discovery
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 via-purple-600 to-blue-600 dark:from-slate-200 dark:via-purple-400 dark:to-blue-400">
              {getMonthName(m)} {y}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              This month's curated discoveries through the Calm Magic compass.
            </p>
          </div>

          {/* Nav arrows */}
          <div className="flex justify-between items-center mt-8">
            {prev ? (
              <Button variant="ghost" onClick={() => navigate(`/drift/${prev.year}/${String(prev.month).padStart(2, '0')}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getMonthName(prev.month)} {prev.year}
              </Button>
            ) : <div />}
            {next ? (
              <Button variant="ghost" onClick={() => navigate(`/drift/${next.year}/${String(next.month).padStart(2, '0')}`)}>
                {getMonthName(next.month)} {next.year}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : <div />}
          </div>
        </div>
      </section>

      {/* Books */}
      <section className="pb-12 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">
          {entry.books.map((book, i) => (
            <Card key={i} className="border-2 hover:shadow-lg transition-all duration-300" style={{ borderColor: `${axisColors[book.axis]}30` }}>
              <CardContent className="p-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    style={{ backgroundColor: `${axisColors[book.axis]}15`, color: axisColors[book.axis], borderColor: `${axisColors[book.axis]}30` }}
                    className="font-semibold"
                  >
                    {axisLabels[book.axis]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {book.category}
                  </Badge>
                </div>

                <div className="flex items-start gap-4">
                  <BookOpen className="w-8 h-8 mt-1 shrink-0" style={{ color: axisColors[book.axis] }} />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">{book.title}</h2>
                    <p className="text-muted-foreground font-medium">{book.author}</p>
                    <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                      Find on Amazon
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Videos */}
      {entry.videos && entry.videos.length > 0 && (
        <section className="pb-20 px-4">
          <div className="container max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Play className="w-6 h-6" />
              Video Discoveries
            </h2>
            {entry.videos.map((video, i) => (
              <Card key={i} className="border-2 hover:shadow-lg transition-all duration-300 overflow-hidden" style={{ borderColor: `${axisColors[video.axis]}30` }}>
                <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="block relative group">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                </a>
                <CardContent className="p-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      style={{ backgroundColor: `${axisColors[video.axis]}15`, color: axisColors[video.axis], borderColor: `${axisColors[video.axis]}30` }}
                      className="font-semibold"
                    >
                      {axisLabels[video.axis]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {video.platform}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">{video.title}</h3>
                    <p className="text-muted-foreground font-medium">{video.speaker}</p>
                    <p className="text-muted-foreground leading-relaxed">{video.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default DriftMonthlyDiscovery;
