'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, TrendingUp, Settings, Activity, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedBackground from "@/components/animated-background";

export default function AdminPage() {
  const [pin, setPin] = useState('');

  const router = useRouter();

  const handleLogout = () => {
    console.log('Logging out');
    sessionStorage.removeItem('admin-auth');
    window.dispatchEvent(new Event('admin-logout'));
  };

  
  return (
    <AnimatedBackground variant="dots" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className='flex justify-between items-center'>

          <h1 className="text-3xl font-bold mb-8 font-heading">Admin Dashboard</h1>
            <button onClick={handleLogout} className=" cursor-pointer z-50 bg-primary text-white px-4 py-2 rounded">
        Logout
      </button>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bet-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium">Total Users</h3>
                    <p className="text-2xl font-bold font-heading">1,234</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bet-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium">Active Users</h3>
                    <p className="text-2xl font-bold font-heading">890</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bet-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium">Total Posts</h3>
                    <p className="text-2xl font-bold font-heading">456</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bet-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium">Pending Approvals</h3>
                    <p className="text-2xl font-bold font-heading">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bet-card mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 font-heading">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/50">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Manage Users</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/50">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>View Reports</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/50"
                  onClick={() => router.push('/admin/add-match')}
                >
                  <Trophy className="h-6 w-6 mb-2" />
                  <span>Add a Match</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bet-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 font-heading">Recent Activity</h2>
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <p className="font-medium">New user registration</p>
                  <p className="text-sm text-muted-foreground">2 minutes ago</p>
                </div>
                <div className="border-b border-border pb-4">
                  <p className="font-medium">Content update</p>
                  <p className="text-sm text-muted-foreground">15 minutes ago</p>
                </div>
                <div className="border-b border-border pb-4">
                  <p className="font-medium">System backup completed</p>
                  <p className="text-sm text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedBackground>
  );
}
