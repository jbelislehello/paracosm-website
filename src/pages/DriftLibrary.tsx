import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { energeticAxes } from "@/data/gardens";
import { driftMonthlyDiscoveries, DriftAxis, axisColors } from "@/data/driftMonthlyDiscoveries";
import Footer from "@/components/Footer";

const DriftLibrary = () => {
  const { axis } = useParams<{ axis: string }>();
  const axisKey = axis as DriftAxis;

  const axisInfo = energeticAxes.find(a => a.key === axisKey);

  if (!axisInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Axis not found</h1>
          <Link to="/drift"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to Drift</Button></Link>
        </div>
      </div>
    );
  }

  const color = axisColors[axisKey];

  // Collect all books for this axis across all months
  const allBooks = driftMonthlyDiscoveries.flatMap(entry =>
    entry.books
      .filter(b => b.axis === axisKey)
      .map(b => ({ ...b, year: entry.year, month: entry.month }))
  );

  const allVideos = driftMonthlyDiscoveries.flatMap(entry =>
    (entry.videos || [])
      .filter(v => v.axis === axisKey)
      .map(v => ({ ...v, year: entry.year, month: entry.month }))
  );

  const allSongs = driftMonthlyDiscoveries.flatMap(entry =>
    (entry.songs || [])
      .filter(s => s.axis === axisKey)
      .map(s => ({ ...s, year: entry.year, month: entry.month }))
  );

  const allPodcasts = driftMonthlyDiscoveries.flatMap(entry =>
    (entry.podcasts || [])
      .filter(p => p.axis === axisKey)
      .map(p => ({ ...p, year: entry.year, month: entry.month }))
  );

  const allArticles = driftMonthlyDiscoveries.flatMap(entry =>
    (entry.articles || [])
      .filter(a => a.axis === axisKey)
      .map(a => ({ ...a, year: entry.year, month: entry.month }))
  );

  const totalResources = allBooks.length + allVideos.length + allSongs.length + allPodcasts.length + allArticles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Header */}
      <section className="py-16 px-4" style={{ background: `linear-gradient(135deg, ${color}08, ${color}15)` }}>
        <div className="container max-w-5xl mx-auto">
          <Link to="/drift">
            <Button variant="ghost" className="mb-8"><ArrowLeft className="w-4 h-4 mr-2" />Back to Drift</Button>
          </Link>
          <div className="space-y-4">
            <Badge style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40` }} className="text-lg px-5 py-2 font-bold">
              {axisInfo.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">{axisInfo.subtitle}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">{axisInfo.description}</p>
            <p className="text-muted-foreground">{totalResources} resources curated across the Drift archive</p>
          </div>
        </div>
      </section>

      {/* Books */}
      {allBooks.length > 0 && (
        <section className="py-12 px-4">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <BookOpen className="w-6 h-6" style={{ color }} />
              Books ({allBooks.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBooks.map((book, i) => (
                <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-opacity-40" style={{ borderColor: `${color}20` }}>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="text-xs">{book.category}</Badge>
                      <span className="text-xs text-muted-foreground">{book.month}/{book.year}</span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">{book.description}</p>
                    {book.amazonUrl && (
                      <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium hover:underline" style={{ color }}>
                        Amazon <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {allVideos.length > 0 && (
        <section className="py-12 px-4 bg-muted/30">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Videos ({allVideos.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allVideos.map((video, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video">
                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${video.youtubeId}`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-bold">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.speaker} • {video.platform}</p>
                    <p className="text-sm text-muted-foreground/80">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default DriftLibrary;
