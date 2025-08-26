import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play } from 'lucide-react';

export default function Module() {
  const { moduleId } = useParams();

  if (moduleId !== 'introducao') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Módulo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Módulo Introdutório</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>O que é Inteligência Artificial?</CardTitle>
              <CardDescription>
                Compreenda os fundamentos da IA e sua importância no mundo moderno
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">
                  A <strong>Inteligência Artificial (IA)</strong> é a capacidade de máquinas e sistemas 
                  computacionais realizarem tarefas que normalmente requerem inteligência humana, 
                  como reconhecimento de padrões, tomada de decisões, compreensão de linguagem 
                  natural e resolução de problemas complexos.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">História da IA</h3>
                <p>
                  O conceito de IA nasceu na década de 1950, quando o matemático inglês 
                  <strong> Alan Turing</strong> propôs o famoso "Teste de Turing" para avaliar 
                  se uma máquina poderia exibir comportamento inteligente equivalente ao humano.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Aplicações no Dia a Dia</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Assistentes Virtuais:</strong> Siri, Alexa, Google Assistant</li>
                  <li><strong>Recomendações:</strong> Netflix, YouTube, Spotify</li>
                  <li><strong>Tradução:</strong> Google Translate, DeepL</li>
                  <li><strong>Navegação:</strong> GPS inteligente, Waze</li>
                  <li><strong>Medicina:</strong> Diagnósticos por imagem, descoberta de medicamentos</li>
                  <li><strong>Carros Autônomos:</strong> Tesla, Waymo</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Tipos de IA</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">IA Fraca (Narrow AI)</h4>
                    <p className="text-sm text-muted-foreground">
                      Especializada em tarefas específicas, como reconhecimento de voz ou 
                      recomendações de produtos.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">IA Forte (General AI)</h4>
                    <p className="text-sm text-muted-foreground">
                      Hipotética IA com capacidades cognitivas equivalentes às humanas 
                      em todas as áreas.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Vídeo Explicativo
              </CardTitle>
              <CardDescription>
                Assista ao vídeo para aprofundar seus conhecimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/JMUxmLyrhSk"
                  title="O que é Inteligência Artificial?"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/quiz/introducao">
                Fazer Quiz do Módulo
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}