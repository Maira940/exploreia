import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, BookOpen, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProgress {
  id: string;
  module_name: string;
  is_completed: boolean;
  score: number;
  completed_at: string | null;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProgress(data || []);
    } catch (error: any) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalModules = 1; // Por enquanto só temos o módulo introdutório
  const completedModules = progress.filter(p => p.is_completed).length;
  const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
  const completionPercentage = (completedModules / totalModules) * 100;

  const getModuleDisplayName = (moduleName: string) => {
    const names: { [key: string]: string } = {
      'introducao': 'Módulo Introdutório'
    };
    return names[moduleName] || moduleName;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando progresso...</p>
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
            <h1 className="text-2xl font-bold">Meu Progresso</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Cards de Estatísticas */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Módulos Concluídos
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedModules}/{totalModules}
                </div>
                <p className="text-xs text-muted-foreground">
                  módulos completados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pontuação Total
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalScore}</div>
                <p className="text-xs text-muted-foreground">
                  pontos acumulados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Progresso do Curso
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(completionPercentage)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  curso completado
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Barra de Progresso Geral */}
          <Card>
            <CardHeader>
              <CardTitle>Progresso Geral do Curso</CardTitle>
              <CardDescription>
                Acompanhe sua evolução no curso Explore IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={completionPercentage} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {completedModules} de {totalModules} módulos concluídos ({Math.round(completionPercentage)}%)
              </p>
            </CardContent>
          </Card>

          {/* Detalhes dos Módulos */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes dos Módulos</CardTitle>
              <CardDescription>
                Veja seu desempenho em cada módulo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {progress.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não começou nenhum módulo.
                  </p>
                  <Button asChild>
                    <Link to="/modulo/introducao">
                      Começar Módulo Introdutório
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {progress.map((moduleProgress) => (
                    <div
                      key={moduleProgress.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium">
                          {getModuleDisplayName(moduleProgress.module_name)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {moduleProgress.is_completed
                            ? `Concluído em ${new Date(moduleProgress.completed_at!).toLocaleDateString('pt-BR')}`
                            : 'Em progresso'
                          }
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{moduleProgress.score} pontos</span>
                        </div>
                        {moduleProgress.is_completed ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            ✓ Concluído
                          </span>
                        ) : (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/quiz/${moduleProgress.module_name}`}>
                              Continuar
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Próximos Passos */}
          {completionPercentage < 100 && (
            <Card>
              <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
                <CardDescription>
                  Continue sua jornada de aprendizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progress.length === 0 && (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Módulo Introdutório</h4>
                        <p className="text-sm text-muted-foreground">
                          Comece sua jornada aprendendo os conceitos básicos
                        </p>
                      </div>
                      <Button asChild>
                        <Link to="/modulo/introducao">
                          Começar
                        </Link>
                      </Button>
                    </div>
                  )}
                  
                  {progress.some(p => !p.is_completed) && (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Continue o Quiz</h4>
                        <p className="text-sm text-muted-foreground">
                          Termine o quiz do módulo introdutório
                        </p>
                      </div>
                      <Button asChild>
                        <Link to="/quiz/introducao">
                          Continuar Quiz
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}