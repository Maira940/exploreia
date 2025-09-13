import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Camera, Download, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasCompletedAllModules, setHasCompletedAllModules] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);

  const modules = ['introducao', 'fundamentos-ml', 'dados-algoritmos', 'redes-neurais', 'ia-etica'];

  useEffect(() => {
    if (user) {
      loadAvatar();
      checkProgress();
      loadCertificate();
    }
  }, [user]);

  const loadAvatar = async () => {
    if (!user) return;
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .list(user.id, { limit: 1 });
    
    if (data && data.length > 0) {
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${user.id}/${data[0].name}`);
      setAvatarUrl(publicUrl);
    }
  };

  const checkProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('progress')
      .select('module_name, is_completed')
      .eq('user_id', user.id)
      .eq('is_completed', true);

    if (data) {
      const completedModules = data.map(p => p.module_name);
      const allCompleted = modules.every(module => completedModules.includes(module));
      setHasCompletedAllModules(allCompleted);
    }
  };

  const loadCertificate = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setCertificate(data);
    }
  };

  const generateCertificate = async () => {
    if (!user || !profile) return;

    const certificateData = {
      studentName: profile.full_name,
      completionDate: new Date().toLocaleDateString('pt-BR'),
      modules: modules,
      id: crypto.randomUUID()
    };

    const { error } = await supabase
      .from('certificates')
      .insert([{
        user_id: user.id,
        certificate_data: certificateData
      }]);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar certificado.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Certificado gerado!",
        description: "Seu certificado de conclusão está pronto.",
      });
      loadCertificate();
    }
  };

  const downloadCertificate = () => {
    if (!certificate) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (A4 landscape proportions)
    canvas.width = 1200;
    canvas.height = 800;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Inner border
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Title
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICADO DE CONCLUSÃO', canvas.width / 2, 140);

    // Subtitle
    ctx.fillStyle = '#475569';
    ctx.font = '24px Arial';
    ctx.fillText('Explore IA - Introdução à Inteligência Artificial', canvas.width / 2, 180);

    // Main text
    ctx.fillStyle = '#1e293b';
    ctx.font = '28px Arial';
    ctx.fillText('Certificamos que', canvas.width / 2, 250);

    // Student name
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(certificate.certificate_data.studentName || 'Estudante', canvas.width / 2, 300);

    // Description
    ctx.fillStyle = '#1e293b';
    ctx.font = '24px Arial';
    ctx.fillText('concluiu com êxito o curso completo incluindo todos os módulos:', canvas.width / 2, 350);

    // Modules list
    const modules = [
      '• Módulo 1: Introdução à IA',
      '• Módulo 2: Fundamentos do Aprendizado de Máquina',
      '• Módulo 3: Representação de Dados e Algoritmos',
      '• Módulo 4: Redes Neurais Artificiais',
      '• Módulo 5: IA e Ética'
    ];

    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    const startY = 390;
    modules.forEach((module, index) => {
      ctx.fillText(module, 200, startY + (index * 25));
    });

    // Date and ID
    ctx.textAlign = 'center';
    ctx.font = '20px Arial';
    ctx.fillText(`Data de conclusão: ${certificate.certificate_data.completionDate}`, canvas.width / 2, 600);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`ID do certificado: ${certificate.certificate_data.id}`, canvas.width / 2, 630);

    // Platform name
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Explore IA Platform', canvas.width / 2, 720);

    // Download the image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const element = document.createElement('a');
        element.href = url;
        element.download = `certificado-explore-ia-${user?.id}.png`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar perfil.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso.",
      });
    }

    setSaving(false);
  };

  if (!user || !profile) {
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
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Gerencie suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback>
                    {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {uploading ? 'Enviando...' : 'Alterar foto'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <Button onClick={saveProfile} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificado de Conclusão
              </CardTitle>
              <CardDescription>
                Complete todos os módulos para receber seu certificado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasCompletedAllModules ? (
                <div className="space-y-4">
                  {certificate ? (
                    <div className="text-center space-y-4">
                      <p className="text-green-600 font-medium">
                        🎉 Parabéns! Você concluiu todos os módulos!
                      </p>
                      <Button onClick={downloadCertificate}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Certificado
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <p className="text-green-600 font-medium">
                        🎉 Você concluiu todos os módulos!
                      </p>
                      <Button onClick={generateCertificate}>
                        <Award className="h-4 w-4 mr-2" />
                        Gerar Certificado
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>Complete todos os módulos e quizzes para gerar seu certificado.</p>
                  <p className="text-sm mt-2">
                    Módulos disponíveis: Introdução à IA, Fundamentos do ML, 
                    Dados e Algoritmos, Redes Neurais, IA e Ética
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}