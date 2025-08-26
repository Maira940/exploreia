import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { LogOut, User, BarChart3 } from 'lucide-react';

export default function Home() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Explore IA</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{profile?.full_name}</span>
              {profile?.role === 'admin' && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                  Admin
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/progresso">
                <BarChart3 className="h-4 w-4 mr-2" />
                Progresso
              </Link>
            </Button>
            {profile?.role === 'admin' && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">Administração</Link>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">
              Bem-vindo ao Explore IA! 🤖
            </h2>
            <p className="text-xl text-muted-foreground">
              Descubra o fascinante mundo da Inteligência Artificial através de 
              módulos interativos e quizzes educativos.
            </p>
          </div>

          <Card className="text-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📚 Módulo Introdutório
              </CardTitle>
              <CardDescription>
                Comece sua jornada aprendendo os conceitos básicos de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Neste módulo você vai aprender:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>O que é Inteligência Artificial</li>
                <li>História e evolução da IA</li>
                <li>Aplicações no dia a dia</li>
                <li>Conceitos fundamentais</li>
              </ul>
              <Button asChild size="lg" className="w-full">
                <Link to="/modulo/introducao">
                  Começar Módulo Introdutório
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Complete os módulos e teste seus conhecimentos com quizzes interativos!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}