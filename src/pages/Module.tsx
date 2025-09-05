import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Brain, Database, Network, Scale, CheckCircle } from 'lucide-react';

// Componente de exercício interativo
function InteractiveExercise() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { user } = useAuth();

  const scenarios = [
    {
      id: 'netflix',
      text: 'Um sistema de recomendação do Netflix analisa milhares de filmes que você já assistiu e avaliou para sugerir novos filmes.',
      options: [
        { id: 'supervisionado', text: 'Aprendizado Supervisionado' },
        { id: 'nao-supervisionado', text: 'Aprendizado Não Supervisionado' },
        { id: 'reforco', text: 'Aprendizado por Reforço' }
      ],
      correct: 'supervisionado',
      explanation: 'O sistema usa dados rotulados (filmes + suas avaliações) para prever suas preferências futuras.'
    },
    {
      id: 'cluster',
      text: 'Uma empresa precisa segmentar seus clientes em grupos baseados nos seus padrões de compra, mas não tem categorias pré-definidas.',
      options: [
        { id: 'supervisionado', text: 'Aprendizado Supervisionado' },
        { id: 'nao-supervisionado', text: 'Aprendizado Não Supervisionado' },
        { id: 'reforco', text: 'Aprendizado por Reforço' }
      ],
      correct: 'nao-supervisionado',
      explanation: 'Como não há categorias pré-definidas, o algoritmo precisa encontrar padrões ocultos nos dados de compra (clustering).'
    },
    {
      id: 'jogo',
      text: 'Um algoritmo aprende a jogar xadrez jogando milhões de partidas contra si mesmo, recebendo pontos por vitórias e perdendo pontos por derrotas.',
      options: [
        { id: 'supervisionado', text: 'Aprendizado Supervisionado' },
        { id: 'nao-supervisionado', text: 'Aprendizado Não Supervisionado' },
        { id: 'reforco', text: 'Aprendizado por Reforço' }
      ],
      correct: 'reforco',
      explanation: 'O algoritmo aprende através de tentativa e erro, recebendo recompensas (vitórias) e punições (derrotas).'
    },
    {
      id: 'diagnostico',
      text: 'Um sistema médico analisa milhares de imagens de raios-X já diagnosticadas por médicos para identificar pneumonia em novas imagens.',
      options: [
        { id: 'supervisionado', text: 'Aprendizado Supervisionado' },
        { id: 'nao-supervisionado', text: 'Aprendizado Não Supervisionado' },
        { id: 'reforco', text: 'Aprendizado por Reforço' }
      ],
      correct: 'supervisionado',
      explanation: 'O sistema usa imagens com diagnósticos conhecidos (dados rotulados) para aprender a classificar novas imagens.'
    },
    {
      id: 'deteccao-fraude',
      text: 'Um banco analisa padrões de transações suspeitas sem saber quais são fraudulentas, buscando identificar comportamentos anômalos.',
      options: [
        { id: 'supervisionado', text: 'Aprendizado Supervisionado' },
        { id: 'nao-supervisionado', text: 'Aprendizado Não Supervisionado' },
        { id: 'reforco', text: 'Aprendizado por Reforço' }
      ],
      correct: 'nao-supervisionado',
      explanation: 'Detecta anomalias nos dados sem ter exemplos prévios rotulados de fraudes, buscando padrões incomuns.'
    }
  ];

  const scenario = scenarios[currentQuestion];

  const handleSubmit = async () => {
    setShowResult(true);
    
    if (selectedAnswer === scenario.correct) {
      const newScore = score + 10;
      setScore(newScore);
      
      // Salvar progresso no banco de dados
      if (user?.id) {
        try {
          const { error } = await supabase
            .from('progress')
            .upsert({
              user_id: user.id,
              module_name: 'fundamentos-ml',
              completed: true,
              score: newScore
            }, {
              onConflict: 'user_id,module_name'
            });
            
          if (!error) {
            toast.success('Resposta correta! +10 pontos');
          }
        } catch (error) {
          console.error('Erro ao salvar progresso:', error);
        }
      }
    } else {
      toast.error('Resposta incorreta. Tente novamente!');
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const resetExercise = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
  };

  return (
    <Card>
        <CardHeader>
          <CardTitle>Exercício Interativo</CardTitle>
          <CardDescription>
            Pergunta {currentQuestion + 1} de {scenarios.length} - Analise o cenário e identifique o tipo de aprendizado
          </CardDescription>
        </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium mb-2">Cenário:</p>
          <p className="text-sm">{scenario.text}</p>
        </div>

        <div className="space-y-3">
          <p className="font-medium">Qual tipo de aprendizado está sendo utilizado?</p>
          {scenario.options.map((option) => (
            <div
              key={option.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswer === option.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              } ${showResult ? 'cursor-not-allowed' : ''}`}
              onClick={() => !showResult && setSelectedAnswer(option.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{option.text}</span>
                {showResult && option.id === scenario.correct && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {showResult && selectedAnswer === option.id && option.id !== scenario.correct && (
                  <span className="text-red-500">✗</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {showResult && (
          <div className={`p-4 border rounded-lg ${
            selectedAnswer === scenario.correct 
              ? 'bg-green-50 dark:bg-green-950 border-green-200' 
              : 'bg-red-50 dark:bg-red-950 border-red-200'
          }`}>
            <p className={`font-medium mb-2 ${
              selectedAnswer === scenario.correct 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {selectedAnswer === scenario.correct ? '✅ Correto! +10 pontos' : '❌ Incorreto'}
            </p>
            <p className={`text-sm ${
              selectedAnswer === scenario.correct 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
            }`}>
              <strong>Explicação:</strong> {scenario.explanation}
            </p>
            {score > 0 && (
              <p className="text-sm font-semibold mt-2">
                Pontuação Total: {score} pontos
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {!showResult ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedAnswer}
              className="flex-1"
            >
              Verificar Resposta
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              {currentQuestion < scenarios.length - 1 ? (
                <Button onClick={nextQuestion} className="flex-1">
                  Próxima Pergunta
                </Button>
              ) : (
                <Button onClick={resetExercise} variant="outline" className="flex-1">
                  Reiniciar Exercício
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componentes de conteúdo para cada módulo
function IntroducaoContent() {
  return (
    <>
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
              src="https://www.youtube.com/embed/CmAcro8YblU"
              title="O que é Inteligência Artificial?"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function FundamentosMLContent() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Diferenças entre IA, ML e Deep Learning
          </CardTitle>
          <CardDescription>
            Entenda as distinções fundamentais entre esses conceitos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-lg mb-2">Inteligência Artificial</h4>
              <p className="text-sm text-muted-foreground">
                Campo amplo que busca criar máquinas capazes de simular inteligência humana.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-lg mb-2">Machine Learning</h4>
              <p className="text-sm text-muted-foreground">
                Subcampo da IA onde máquinas aprendem padrões dos dados sem programação explícita.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-lg mb-2">Deep Learning</h4>
              <p className="text-sm text-muted-foreground">
                Subcampo do ML que usa redes neurais profundas para aprender representações complexas.
              </p>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mt-6 mb-4">Tipos de Aprendizado de Máquina</h3>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold">Aprendizado Supervisionado</h4>
              <p className="text-sm">Aprende com dados rotulados (entrada + resposta correta)</p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold">Aprendizado Não Supervisionado</h4>
              <p className="text-sm">Encontra padrões em dados sem rótulos</p>
            </div>
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
              <h4 className="font-semibold">Aprendizado por Reforço</h4>
              <p className="text-sm">Aprende através de recompensas e punições</p>
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
            Assista ao vídeo para aprofundar seus conhecimentos sobre Machine Learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/KxkP6Zv_7y0"
              title="Fundamentos do Machine Learning"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </CardContent>
      </Card>

      <InteractiveExercise />
    </>
  );
}

function DadosAlgoritmosContent() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Importância dos Dados na IA
          </CardTitle>
          <CardDescription>
            Entenda por que os dados são o combustível da IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">
            Os dados são o <strong>combustível da IA</strong>. Sem dados de qualidade, 
            mesmo os algoritmos mais sofisticados não conseguem produzir resultados úteis.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-4">Características de Dados de Qualidade</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Precisão</h4>
              <p className="text-sm text-muted-foreground">
                Os dados devem representar corretamente a realidade
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Completude</h4>
              <p className="text-sm text-muted-foreground">
                Informações essenciais não devem estar ausentes
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Consistência</h4>
              <p className="text-sm text-muted-foreground">
                Dados devem ser uniformes e seguir padrões
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Atualidade</h4>
              <p className="text-sm text-muted-foreground">
                Informações devem ser relevantes e atuais
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4">Algoritmos Fundamentais</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">Árvores de Decisão</h4>
              <p className="text-sm text-muted-foreground">Estrutura hierárquica para tomada de decisões</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">Regressão Linear</h4>
              <p className="text-sm text-muted-foreground">Encontra relações lineares entre variáveis</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">K-Means</h4>
              <p className="text-sm text-muted-foreground">Agrupa dados similares em clusters</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exercício: Organize a Sequência</CardTitle>
          <CardDescription>
            Como um algoritmo usa dados para tomar decisões?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="font-medium">Ordene os passos corretos:</p>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 rounded-lg">
                <span className="font-bold text-blue-700 dark:text-blue-300">1.</span> Coleta de Dados
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 rounded-lg">
                <span className="font-bold text-green-700 dark:text-green-300">2.</span> Pré-processamento e Limpeza
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 rounded-lg">
                <span className="font-bold text-yellow-700 dark:text-yellow-300">3.</span> Treinamento do Algoritmo
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 rounded-lg">
                <span className="font-bold text-purple-700 dark:text-purple-300">4.</span> Validação e Teste
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg">
                <span className="font-bold text-red-700 dark:text-red-300">5.</span> Implementação e Decisão
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function RedesNeuraisContent() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Introdução às Redes Neurais
          </CardTitle>
          <CardDescription>
            Entenda como funcionam as redes neurais artificiais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">
            As <strong>Redes Neurais Artificiais</strong> são sistemas computacionais inspirados 
            no funcionamento do cérebro humano, compostos por neurônios artificiais conectados 
            que processam informações de forma paralela.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-4">Estrutura de uma Rede Neural</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-bold">E</span>
              </div>
              <h4 className="font-semibold">Camada de Entrada</h4>
              <p className="text-sm text-muted-foreground">Recebe os dados de entrada</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-300 font-bold">O</span>
              </div>
              <h4 className="font-semibold">Camadas Ocultas</h4>
              <p className="text-sm text-muted-foreground">Processam e transformam os dados</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-300 font-bold">S</span>
              </div>
              <h4 className="font-semibold">Camada de Saída</h4>
              <p className="text-sm text-muted-foreground">Produz o resultado final</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4">Como Funcionam</h3>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold">1. Propagação Direta</h4>
              <p className="text-sm">Os dados fluem da entrada para a saída através das camadas</p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold">2. Cálculo do Erro</h4>
              <p className="text-sm">Compare o resultado com a resposta esperada</p>
            </div>
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
              <h4 className="font-semibold">3. Retropropagação</h4>
              <p className="text-sm">Ajusta os pesos das conexões para reduzir o erro</p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold">4. Repetição</h4>
              <p className="text-sm">Repete o processo até atingir precisão satisfatória</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Explique com suas palavras</CardTitle>
          <CardDescription>
            Responda em 2-3 linhas: O que uma rede neural faz?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Exemplo de resposta:</strong>
            </p>
            <p className="text-sm">
              "Uma rede neural pega informações de entrada, processa essas informações através 
              de várias camadas de 'neurônios' artificiais que estão conectados entre si, e 
              produz uma resposta ou previsão. É como se ela 'aprendesse' padrões nos dados 
              para tomar decisões inteligentes."
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function IAEticaContent() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            IA e Questões Éticas
          </CardTitle>
          <CardDescription>
            Compreenda os desafios éticos do uso da IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">
            Com o avanço da IA, surgem questões éticas importantes sobre como essas 
            tecnologias devem ser desenvolvidas e utilizadas de forma responsável.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-4">Viés Algorítmico</h3>
          <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
            <p className="text-sm">
              <strong>Definição:</strong> Quando algoritmos reproduzem ou amplificam 
              preconceitos existentes nos dados de treinamento ou na sociedade.
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4">Principais Preocupações Éticas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-red-600 dark:text-red-400">Privacidade</h4>
              <p className="text-sm text-muted-foreground">
                Coleta e uso inadequado de dados pessoais
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-orange-600 dark:text-orange-400">Transparência</h4>
              <p className="text-sm text-muted-foreground">
                Falta de clareza sobre como decisões são tomadas
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">Responsabilidade</h4>
              <p className="text-sm text-muted-foreground">
                Quem é responsável por decisões da IA?
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">Impacto Social</h4>
              <p className="text-sm text-muted-foreground">
                Efeitos no emprego e na sociedade
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4">Diretrizes para Uso Responsável</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-700 dark:text-green-300">✓ Inclusividade</h4>
              <p className="text-sm">Garantir que a IA beneficie todos os grupos da sociedade</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300">✓ Transparência</h4>
              <p className="text-sm">Explicar como e por que decisões são tomadas</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300">✓ Accountability</h4>
              <p className="text-sm">Estabelecer responsabilidades claras</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-700 dark:text-orange-300">✓ Segurança</h4>
              <p className="text-sm">Proteger contra usos maliciosos ou prejudiciais</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formulário Opinativo</CardTitle>
          <CardDescription>
            Reflita sobre o uso da IA na educação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-semibold">
              Você usaria IA para corrigir provas? Por quê?
            </h4>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Pontos para reflexão:</strong>
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Eficiência vs. Personalização</li>
                <li>Feedback mais rápido para estudantes</li>
                <li>Possibilidade de viés na correção</li>
                <li>Perda do toque humano na avaliação</li>
                <li>Capacidade de avaliar criatividade e pensamento crítico</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function Module() {
  const { moduleId } = useParams();

  const getModuleContent = () => {
    switch (moduleId) {
      case 'introducao':
        return {
          title: 'Módulo 1: Introdução à IA',
          content: <IntroducaoContent />,
          hasQuiz: true
        };
      case 'fundamentos-ml':
        return {
          title: 'Módulo 2: Fundamentos do Aprendizado de Máquina',
          content: <FundamentosMLContent />,
          hasQuiz: false
        };
      case 'dados-algoritmos':
        return {
          title: 'Módulo 3: Representação de Dados e Algoritmos',
          content: <DadosAlgoritmosContent />,
          hasQuiz: true
        };
      case 'redes-neurais':
        return {
          title: 'Módulo 4: Redes Neurais Artificiais',
          content: <RedesNeuraisContent />,
          hasQuiz: true
        };
      case 'ia-etica':
        return {
          title: 'Módulo 5: IA e Ética',
          content: <IAEticaContent />,
          hasQuiz: true
        };
      default:
        return null;
    }
  };

  const moduleContent = getModuleContent();

  if (!moduleContent) {
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
            <h1 className="text-2xl font-bold">{moduleContent.title}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {moduleContent.content}
          
          {moduleContent.hasQuiz && (
            <div className="text-center pt-8 border-t">
              <Button asChild size="lg">
                <Link to={`/quiz/${moduleId}`}>
                  Fazer Quiz do Módulo
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}