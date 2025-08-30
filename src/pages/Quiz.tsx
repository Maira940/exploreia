import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Quiz {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  points: number;
}

export default function Quiz() {
  const { moduleId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, [moduleId]);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('module_name', moduleId);

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || !user) return;

    const currentQuiz = quizzes[currentQuizIndex];
    const correct = selectedAnswer === currentQuiz.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const newScore = totalScore + currentQuiz.points;
      setTotalScore(newScore);
      
      toast({
        title: "Parabéns, você acertou! 🎉",
        description: `+${currentQuiz.points} pontos`,
      });

      // Update progress in database
      try {
        await supabase
          .from('progress')
          .upsert({
            user_id: user.id,
            module_name: moduleId,
            score: newScore,
            is_completed: currentQuizIndex === quizzes.length - 1,
            completed_at: currentQuizIndex === quizzes.length - 1 ? new Date().toISOString() : null,
          });
      } catch (error: any) {
        console.error('Error updating progress:', error);
      }
    } else {
      toast({
        title: "Resposta incorreta",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando quiz...</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <p>Nenhum quiz encontrado para este módulo</p>
            <Button asChild className="mt-4">
              <Link to="/">Voltar ao início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuiz = quizzes[currentQuizIndex];
  const isLastQuestion = currentQuizIndex === quizzes.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/modulo/${moduleId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Quiz - {moduleId}</h1>
            <span className="text-sm text-muted-foreground">
              {currentQuizIndex + 1} de {quizzes.length}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Questão {currentQuizIndex + 1}</CardTitle>
              <CardDescription>
                Escolha a alternativa correta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-medium">{currentQuiz.question}</h3>
              
              <RadioGroup
                key={currentQuizIndex}
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                disabled={showResult}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="a" id="a" />
                  <Label htmlFor="a" className="flex-1 cursor-pointer">
                    a) {currentQuiz.option_a}
                  </Label>
                  {showResult && currentQuiz.correct_answer === 'a' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showResult && selectedAnswer === 'a' && currentQuiz.correct_answer !== 'a' && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="b" id="b" />
                  <Label htmlFor="b" className="flex-1 cursor-pointer">
                    b) {currentQuiz.option_b}
                  </Label>
                  {showResult && currentQuiz.correct_answer === 'b' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showResult && selectedAnswer === 'b' && currentQuiz.correct_answer !== 'b' && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="c" id="c" />
                  <Label htmlFor="c" className="flex-1 cursor-pointer">
                    c) {currentQuiz.option_c}
                  </Label>
                  {showResult && currentQuiz.correct_answer === 'c' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showResult && selectedAnswer === 'c' && currentQuiz.correct_answer !== 'c' && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="d" id="d" />
                  <Label htmlFor="d" className="flex-1 cursor-pointer">
                    d) {currentQuiz.option_d}
                  </Label>
                  {showResult && currentQuiz.correct_answer === 'd' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showResult && selectedAnswer === 'd' && currentQuiz.correct_answer !== 'd' && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </RadioGroup>

              <div className="flex gap-4">
                {!showResult ? (
                  <Button 
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    className="flex-1"
                  >
                    Confirmar Resposta
                  </Button>
                ) : (
                  <>
                    {!isLastQuestion ? (
                      <Button onClick={nextQuestion} className="flex-1">
                        Próxima Questão
                      </Button>
                    ) : (
                      <Button asChild className="flex-1">
                        <Link to="/progresso">
                          Ver Progresso
                        </Link>
                      </Button>
                    )}
                  </>
                )}
              </div>

              {totalScore > 0 && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="font-medium">Pontuação atual: {totalScore} pontos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}