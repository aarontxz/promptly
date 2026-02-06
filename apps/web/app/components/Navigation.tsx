'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';

export function Navigation() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (!session) return null;

  return (
    <div className="bg-green-600 border-b border-green-700 h-16 px-6">
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  href="/decks" 
                  className="text-white hover:text-green-200 transition-colors font-medium px-4 py-2 rounded-md hover:bg-green-700"
                >
                  My Decks
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-white">
              {session.user?.name}
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-white hover:text-green-200 hover:bg-green-700"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
