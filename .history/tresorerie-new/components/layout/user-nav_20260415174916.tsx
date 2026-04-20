"use client";

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function UserNav() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">{user?.name || user?.email || 'Utilisateur'}</span>
      <Button variant="ghost" size="icon" onClick={logout} title="Déconnexion">
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
}
