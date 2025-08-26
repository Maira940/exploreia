import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Explore IA</CardTitle>
          <CardDescription>
            Plataforma de ensino sobre Inteligência Artificial
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Faça login ou cadastre-se para começar sua jornada de aprendizado em IA
          </p>
          <Button asChild size="lg" className="w-full">
            <Link to="/auth">
              Entrar na Plataforma
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
