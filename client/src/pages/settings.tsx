import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Mail, User, Lock, Settings as SettingsIcon, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>({ firstName: '', lastName: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [passwords, setPasswords] = useState({ current: '', password: '', confirm: '' });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      // Try to call API if available, otherwise update localStorage
      const payload = { firstName: user.firstName, lastName: user.lastName, email: user.email };
      try {
        const res = await fetch('/api/user/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('user', JSON.stringify(data));
          setUser(data);
          alert('Profile saved');
        } else {
          // fallback: localStorage
          localStorage.setItem('user', JSON.stringify(payload));
          alert('Profile saved locally');
        }
      } catch (err) {
        localStorage.setItem('user', JSON.stringify(payload));
        alert('Profile saved locally (no API)');
      }
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationPrefs = () => {
    // persist locally; app can read this to control behaviour
    localStorage.setItem('notificationPrefs', JSON.stringify(notifications));
    alert('Notification preferences saved');
  };

  const changePassword = async () => {
    if (passwords.password !== passwords.confirm) return alert('Passwords do not match');
    try {
      const res = await fetch('/api/user/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(passwords) });
      if (res.ok) {
        alert('Password changed');
        setPasswords({ current: '', password: '', confirm: '' });
      } else {
        const text = await res.text();
        alert('Failed to change password: ' + text);
      }
    } catch (err) {
      alert('Unable to change password (no API)');
    }
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action is irreversible.')) return;
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      if (res.ok) {
        localStorage.removeItem('user');
        alert('Account deleted');
        window.location.href = '/';
      } else {
        alert('Failed to delete account');
      }
    } catch (err) {
      alert('Unable to delete account (no API)');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-5 h-5" />
              <CardTitle>Settings</CardTitle>
            </div>
            <CardDescription>Manage your profile, security and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First name</Label>
                    <Input value={user.firstName || ''} onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
                  </div>
                  <div>
                    <Label>Last name</Label>
                    <Input value={user.lastName || ''} onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Email</Label>
                    <Input value={user.email || ''} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={saveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</Button>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current password</Label>
                    <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                  </div>
                  <div>
                    <Label>New password</Label>
                    <Input type="password" value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} />
                  </div>
                  <div>
                    <Label>Confirm new password</Label>
                    <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={changePassword}>Change password</Button>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email notifications</div>
                      <div className="text-sm text-muted-foreground">Receive updates and messages by email</div>
                    </div>
                    <Switch checked={notifications.email} onCheckedChange={(v: any) => setNotifications({ ...notifications, email: !!v })} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS notifications</div>
                      <div className="text-sm text-muted-foreground">Receive important alerts by SMS</div>
                    </div>
                    <Switch checked={notifications.sms} onCheckedChange={(v: any) => setNotifications({ ...notifications, sms: !!v })} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={saveNotificationPrefs}>Save preferences</Button>
                </div>
              </TabsContent>

              <TabsContent value="account" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <div className="font-medium">Danger zone</div>
                    <div className="text-sm text-muted-foreground">Delete your account and all data associated with it.</div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="destructive" onClick={deleteAccount}><Trash2 className="w-4 h-4 mr-2"/>Delete account</Button>
                    <Button onClick={() => alert('No action')}>Deactivate</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter />
        </Card>
      </div>
    </div>
  );
}
