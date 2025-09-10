import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { LogOut, User, BarChart3 } from 'lucide-react';
import exploreIALogo from '/lovable-uploads/f9c9062a-04be-46fc-9868-7031f233b593.png';

export default function Home() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={exploreIALogo} alt="Explore IA Logo" className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Explore IA</h1>
          </div>
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/perfil">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Link>
              </Button>
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

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📚 Módulo 1: Introdução à IA
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
                    Começar Módulo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🧠 Módulo 2: Fundamentos do ML
                </CardTitle>
                <CardDescription>
                  Diferenças entre IA, ML e Deep Learning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Neste módulo você vai aprender:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Diferença entre IA, ML e Deep Learning</li>
                  <li>Tipos de aprendizado de máquina</li>
                  <li>Algoritmos básicos</li>
                  <li>Exercício situacional</li>
                </ul>
                <Button asChild size="lg" className="w-full">
                  <Link to="/modulo/fundamentos-ml">
                    Começar Módulo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Módulo 3: Dados e Algoritmos
                </CardTitle>
                <CardDescription>
                  Importância dos dados na IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Neste módulo você vai aprender:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Importância dos dados na IA</li>
                  <li>Algoritmos fundamentais</li>
                  <li>Análise de dados</li>
                  <li>Exercício de organização</li>
                </ul>
                <Button asChild size="lg" className="w-full">
                  <Link to="/modulo/dados-algoritmos">
                    Começar Módulo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔗 Módulo 4: Redes Neurais
                </CardTitle>
                <CardDescription>
                  Estrutura e funcionamento de redes neurais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Neste módulo você vai aprender:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Introdução a redes neurais</li>
                  <li>Estrutura e funcionamento</li>
                  <li>Como as redes neurais aprendem</li>
                  <li>Exercício explicativo</li>
                </ul>
                <Button asChild size="lg" className="w-full">
                  <Link to="/modulo/redes-neurais">
                    Começar Módulo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚖️ Módulo 5: IA e Ética
                </CardTitle>
                <CardDescription>
                  Questões éticas no uso da IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Neste módulo você vai aprender:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Viés algorítmico e impactos sociais</li>
                  <li>Questões éticas no uso da IA</li>
                  <li>Diretrizes para uso responsável</li>
                  <li>Formulário opinativo</li>
                </ul>
                <Button asChild size="lg" className="w-full">
                  <Link to="/modulo/ia-etica">
                    Começar Módulo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

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