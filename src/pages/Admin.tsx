import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Quiz {
  id: string;
  module_name: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  points: number;
}

export default function Admin() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    module_name: '',
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: '',
    points: 10,
  });

  useEffect(() => {
    if (profile?.role !== 'admin') return;
    fetchQuizzes();
  }, [profile]);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('module_name', { ascending: true });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os quizzes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingQuiz) {
        const { error } = await supabase
          .from('quizzes')
          .update(formData)
          .eq('id', editingQuiz.id);

        if (error) throw error;
        
        toast({
          title: "Quiz atualizado!",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('quizzes')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Quiz criado!",
          description: "O novo quiz foi adicionado com sucesso.",
        });
      }

      resetForm();
      fetchQuizzes();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      module_name: quiz.module_name,
      question: quiz.question,
      option_a: quiz.option_a,
      option_b: quiz.option_b,
      option_c: quiz.option_c,
      option_d: quiz.option_d,
      correct_answer: quiz.correct_answer,
      points: quiz.points,
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este quiz?')) return;

    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Quiz excluído!",
        description: "O quiz foi removido com sucesso.",
      });
      
      fetchQuizzes();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      module_name: '',
      question: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: '',
      points: 10,
    });
    setIsCreating(false);
    setEditingQuiz(null);
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <p>Acesso restrito a administradores</p>
            <Button asChild className="mt-4">
              <Link to="/">Voltar ao início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
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
            <h1 className="text-2xl font-bold">Administração</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header com botão de criar */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Gerenciar Quizzes</h2>
              <p className="text-muted-foreground">
                Crie, edite e exclua quizzes dos módulos
              </p>
            </div>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Quiz
            </Button>
          </div>

          {/* Formulário de criação/edição */}
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingQuiz ? 'Editar Quiz' : 'Criar Novo Quiz'}
                </CardTitle>
                <CardDescription>
                  Preencha os campos para {editingQuiz ? 'atualizar' : 'criar'} um quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="module_name">Módulo</Label>
                      <Select
                        value={formData.module_name}
                        onValueChange={(value) => 
                          setFormData({ ...formData, module_name: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o módulo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="introducao">Módulo Introdutório</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points">Pontos</Label>
                      <Input
                        id="points"
                        type="number"
                        value={formData.points}
                        onChange={(e) => 
                          setFormData({ ...formData, points: parseInt(e.target.value) })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question">Pergunta</Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) => 
                        setFormData({ ...formData, question: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="option_a">Alternativa A</Label>
                      <Input
                        id="option_a"
                        value={formData.option_a}
                        onChange={(e) => 
                          setFormData({ ...formData, option_a: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option_b">Alternativa B</Label>
                      <Input
                        id="option_b"
                        value={formData.option_b}
                        onChange={(e) => 
                          setFormData({ ...formData, option_b: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option_c">Alternativa C</Label>
                      <Input
                        id="option_c"
                        value={formData.option_c}
                        onChange={(e) => 
                          setFormData({ ...formData, option_c: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option_d">Alternativa D</Label>
                      <Input
                        id="option_d"
                        value={formData.option_d}
                        onChange={(e) => 
                          setFormData({ ...formData, option_d: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correct_answer">Resposta Correta</Label>
                    <Select
                      value={formData.correct_answer}
                      onValueChange={(value) => 
                        setFormData({ ...formData, correct_answer: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a resposta correta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a">A</SelectItem>
                        <SelectItem value="b">B</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                        <SelectItem value="d">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit">
                      {editingQuiz ? 'Atualizar' : 'Criar'} Quiz
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de quizzes */}
          <Card>
            <CardHeader>
              <CardTitle>Quizzes Existentes</CardTitle>
              <CardDescription>
                Gerencie todos os quizzes da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quizzes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum quiz encontrado
                </p>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {quiz.module_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {quiz.points} pontos
                          </span>
                        </div>
                        <h4 className="font-medium">{quiz.question}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>a) {quiz.option_a}</p>
                          <p>b) {quiz.option_b}</p>
                          <p>c) {quiz.option_c}</p>
                          <p>d) {quiz.option_d}</p>
                          <p className="font-medium text-green-600">
                            Resposta correta: {quiz.correct_answer.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(quiz)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(quiz.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}