-- Inserir quizzes para o módulo 2: Fundamentos de ML
INSERT INTO public.quizzes (module_name, question, option_a, option_b, option_c, option_d, correct_answer, points) VALUES
('fundamentos-ml', 'Um sistema de recomendação do Netflix analisa milhares de filmes que você já assistiu e avaliou para sugerir novos filmes. Qual tipo de aprendizado está sendo utilizado?', 'Aprendizado Supervisionado', 'Aprendizado Não Supervisionado', 'Aprendizado por Reforço', 'Deep Learning', 'a', 10),
('fundamentos-ml', 'Uma empresa precisa segmentar seus clientes em grupos baseados nos seus padrões de compra, mas não tem categorias pré-definidas. Qual tipo de aprendizado é mais adequado?', 'Aprendizado Supervisionado', 'Aprendizado Não Supervisionado', 'Aprendizado por Reforço', 'Machine Learning Supervisionado', 'b', 10),
('fundamentos-ml', 'Um algoritmo aprende a jogar xadrez jogando milhões de partidas contra si mesmo, recebendo pontos por vitórias e perdendo pontos por derrotas. Qual tipo de aprendizado?', 'Aprendizado Supervisionado', 'Aprendizado Não Supervisionado', 'Aprendizado por Reforço', 'Deep Learning', 'c', 10),
('fundamentos-ml', 'Qual é a principal diferença entre IA e Machine Learning?', 'São a mesma coisa', 'ML é um subcampo da IA', 'IA é um subcampo do ML', 'Não há relação entre eles', 'b', 10),
('fundamentos-ml', 'Deep Learning é um subcampo de qual área?', 'Inteligência Artificial apenas', 'Machine Learning', 'Ciência da Computação', 'Estatística', 'b', 10),
('fundamentos-ml', 'Em qual situação o aprendizado supervisionado é mais adequado?', 'Quando não temos dados rotulados', 'Quando queremos encontrar padrões ocultos', 'Quando temos dados com respostas conhecidas', 'Quando o algoritmo deve aprender por tentativa e erro', 'c', 10),
('fundamentos-ml', 'Um sistema médico analisa milhares de imagens de raios-X já diagnosticadas por médicos para identificar pneumonia em novas imagens. Que tipo de aprendizado?', 'Aprendizado Supervisionado', 'Aprendizado Não Supervisionado', 'Aprendizado por Reforço', 'Clustering', 'a', 10),
('fundamentos-ml', 'Qual característica define o aprendizado não supervisionado?', 'Usa dados rotulados', 'Recebe feedback do ambiente', 'Encontra padrões sem rótulos', 'Aprende por recompensas', 'c', 10);

-- Inserir quizzes para o módulo 3: Dados e Algoritmos  
INSERT INTO public.quizzes (module_name, question, option_a, option_b, option_c, option_d, correct_answer, points) VALUES
('dados-algoritmos', 'Uma empresa tem dados históricos de vendas, mas 30% dos registros estão com informações de preço faltando. Qual é o principal problema?', 'Falta de algoritmo adequado', 'Volume insuficiente de dados', 'Qualidade dos dados (completude)', 'Excesso de dados', 'c', 10),
('dados-algoritmos', 'Um algoritmo de reconhecimento de imagens tem baixa precisão. As imagens de treinamento têm diferentes condições de luz. O que deve ser feito?', 'Coletar mais imagens', 'Normalizar e preprocessar as imagens', 'Usar um algoritmo diferente', 'Reduzir o dataset', 'b', 10),
('dados-algoritmos', 'Um sistema de IA para análise de currículos foi treinado com dados históricos de uma empresa e começou a favorecer candidatos homens. Qual é o problema?', 'Algoritmo inadequado', 'Viés nos dados de treinamento', 'Falta de dados', 'Erro de programação', 'b', 10),
('dados-algoritmos', 'Qual é uma característica essencial de dados de qualidade?', 'Grande volume', 'Completude e precisão', 'Complexidade', 'Diversidade apenas', 'b', 10),
('dados-algoritmos', 'O que é feature engineering?', 'Criação de novos algoritmos', 'Processo de seleção e criação de variáveis relevantes', 'Correção de bugs', 'Aumento do dataset', 'b', 10),
('dados-algoritmos', 'Por que o preprocessamento de dados é importante?', 'Para reduzir o tamanho do dataset', 'Para garantir consistência e qualidade dos dados', 'Para acelerar o treinamento apenas', 'Para criar mais dados', 'b', 10),
('dados-algoritmos', 'Qual algoritmo é mais adequado para classificação de emails como spam ou não spam?', 'K-means', 'Regressão Linear', 'Árvore de Decisão', 'PCA', 'c', 10),
('dados-algoritmos', 'O que pode causar overfitting em um modelo de ML?', 'Poucos dados de treinamento', 'Modelo muito simples', 'Modelo muito complexo para os dados disponíveis', 'Dados de alta qualidade', 'c', 10);

-- Inserir quizzes para o módulo 4: Redes Neurais
INSERT INTO public.quizzes (module_name, question, option_a, option_b, option_c, option_d, correct_answer, points) VALUES
('redes-neurais', 'O que são neurônios artificiais em uma rede neural?', 'Componentes físicos do computador', 'Unidades de processamento que recebem entradas e produzem saídas', 'Algoritmos de otimização', 'Bancos de dados', 'b', 10),
('redes-neurais', 'Qual é a função da função de ativação em um neurônio?', 'Armazenar dados', 'Determinar se o neurônio deve ser ativado', 'Conectar neurônios', 'Corrigir erros', 'b', 10),
('redes-neurais', 'O que é backpropagation?', 'Processo de criação de neurônios', 'Algoritmo para treinar redes neurais ajustando pesos', 'Tipo de rede neural', 'Função de ativação', 'b', 10),
('redes-neurais', 'Quantas camadas uma rede neural profunda (deep learning) deve ter?', 'Exatamente 3', 'Múltiplas camadas ocultas (geralmente mais de 2)', 'Apenas 1', 'Sempre 10', 'b', 10),
('redes-neurais', 'Para que são mais adequadas as Redes Neurais Convolucionais (CNNs)?', 'Processamento de texto', 'Processamento de imagens', 'Séries temporais', 'Dados tabulares simples', 'b', 10),
('redes-neurais', 'O que acontece durante o treinamento de uma rede neural?', 'Os neurônios são criados', 'Os pesos das conexões são ajustados', 'A arquitetura da rede muda', 'Os dados são limpos', 'b', 10),
('redes-neurais', 'Qual é uma vantagem das redes neurais?', 'Sempre são interpretáveis', 'Requerem poucos dados', 'Podem aprender padrões complexos', 'São sempre rápidas', 'c', 10),
('redes-neurais', 'O que é uma época (epoch) no treinamento de redes neurais?', 'Um tipo de neurônio', 'Uma passada completa pelos dados de treinamento', 'Uma função de ativação', 'Um algoritmo de otimização', 'b', 10);

-- Inserir quizzes para o módulo 5: IA e Ética
INSERT INTO public.quizzes (module_name, question, option_a, option_b, option_c, option_d, correct_answer, points) VALUES
('ia-etica', 'O que é viés algorítmico?', 'Erro de programação', 'Preferências injustas em decisões automatizadas', 'Lentidão do algoritmo', 'Complexidade excessiva', 'b', 10),
('ia-etica', 'Como podemos reduzir o viés em sistemas de IA?', 'Usar mais dados', 'Diversificar dados de treinamento e auditorias regulares', 'Aumentar a velocidade', 'Simplificar o algoritmo', 'b', 10),
('ia-etica', 'O que significa transparência em IA?', 'Código aberto obrigatório', 'Capacidade de explicar como decisões são tomadas', 'Acesso público aos dados', 'Interface simples', 'b', 10),
('ia-etica', 'Qual é uma preocupação ética importante sobre IA no mercado de trabalho?', 'IA é muito cara', 'Automação pode eliminar empregos', 'IA é muito lenta', 'IA consome muita energia', 'b', 10),
('ia-etica', 'O que é "caixa preta" em IA?', 'Hardware específico', 'Sistema cujas decisões são difíceis de interpretar', 'Tipo de algoritmo', 'Interface de usuário', 'b', 10),
('ia-etica', 'Qual princípio é fundamental para IA responsável?', 'Máxima velocidade', 'Accountability e responsabilidade', 'Menor custo', 'Maior complexidade', 'b', 10),
('ia-etica', 'Como garantir privacidade em sistemas de IA?', 'Usar mais dados', 'Implementar técnicas de anonimização e proteção de dados', 'Acelerar processamento', 'Simplificar modelos', 'b', 10),
('ia-etica', 'O que devemos considerar antes de implementar IA em áreas sensíveis como saúde?', 'Apenas o custo', 'Impactos éticos, segurança e equidade', 'Apenas a velocidade', 'Apenas a precisão técnica', 'b', 10);