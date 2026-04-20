'use client'

import { useApp } from '@/lib/app-context'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDateTime } from '@/lib/format'
import { useRouter } from 'next/navigation'

export function AppHeader() {
  const { notifications, unreadCount, markAsRead } = useApp()
  const { user, logout } = useAuth()
  const router = useRouter()
  const isTresorier = user?.role === 'TRESORIER'
  const isAdminBanque = user?.role === 'ADMIN_BANQUE'

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header
      className={cn('fixed left-60 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-[#DDE3EF] bg-white px-8')}
    >
      {/* Company Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#1B2E5E]">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="text-sm font-semibold text-[#1B2E5E]">Adria Business and Technology</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Role Badge (non-interactive) */}
        {user && (
          <div
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium',
              isTresorier
                ? 'bg-[#3B6FD4]/10 text-[#3B6FD4]'
                : isAdminBanque
                  ? 'bg-[#0F766E]/10 text-[#0F766E]'
                  : 'bg-[#7C3AED]/10 text-[#7C3AED]'
            )}
          >
            {isTresorier ? 'TRÉSORIER' : isAdminBanque ? 'ADMIN BANQUE' : 'ADMIN CLIENT'}
          </div>
        )}

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-[#64748B]" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#DC2626] text-xs font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-[#DDE3EF] p-3">
              <h4 className="font-semibold text-[#1B2E5E]">Notifications</h4>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-[#64748B]">
                  Aucune notification
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'cursor-pointer border-b border-[#DDE3EF] p-3 last:border-0',
                      !notification.read && 'bg-[#F4F6FB]'
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          'mt-1 h-2 w-2 rounded-full',
                          notification.type === 'error' && 'bg-[#DC2626]',
                          notification.type === 'warning' && 'bg-[#D97706]',
                          notification.type === 'success' && 'bg-[#16A34A]',
                          notification.type === 'info' && 'bg-[#3B6FD4]'
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1B2E5E]">{notification.title}</p>
                        <p className="text-xs text-[#64748B]">{notification.message}</p>
                        <p className="mt-1 text-xs text-[#64748B]">
                          {formatDateTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B2E5E] text-sm font-medium text-white hover:bg-[#2D4A8A] transition-colors">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user && (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-[#1B2E5E]">{user.name}</p>
                  <p className="text-xs text-[#64748B]">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleLogout} className="text-[#DC2626]">
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
