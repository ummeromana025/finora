import { useState } from 'react'
import { useAuth } from '@/store'
import { Button, Card, Input } from '@/ui'
import { Tabs, useToast } from '@/ui/extra'
const Toggle = ({ label, def = false }: { label: string; def?: boolean }) => { const [on, set] = useState(def); return <label className="flex items-center justify-between py-2 text-sm">{label}<input type="checkbox" role="switch" checked={on} onChange={() => set(!on)} className="size-5" /></label> }
export default function Settings() {
  const [tab, setTab] = useState('Profile'); const user = useAuth((s) => s.user); const toast = useToast((s) => s.push)
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Settings</h1><Tabs tabs={['Profile', 'Security', 'Notifications']} value={tab} onChange={setTab} />
    <Card className="max-w-lg space-y-3">
      {tab === 'Profile' && <><Input label="Name" defaultValue={user?.name} /><Input label="Phone" placeholder="+92 300 0000000" /><Button onClick={() => toast('Profile saved')}>Save changes</Button></>}
      {tab === 'Security' && <><Toggle label="Two-factor authentication" def /><Toggle label="Session timeout after 15 minutes" def /><Button onClick={() => toast('Security settings saved')}>Save changes</Button></>}
      {tab === 'Notifications' && <><Toggle label="Email alerts for transfers" def /><Toggle label="Weekly spending summary" /><Toggle label="Low balance alerts" def /><Button onClick={() => toast('Preferences saved')}>Save changes</Button></>}
    </Card></div>
}
