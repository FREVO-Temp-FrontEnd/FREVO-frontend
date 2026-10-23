/* Isolated design preview. Does not modify the application routes or screens. */
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import { ThemeProvider, CssBaseline, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowUpRight, ArrowRight, Search, ChevronDown, Check, Clock3, MessageCircle, LockKeyhole, FileText, BriefcaseBusiness, CalendarDays, CircleCheck, X } from 'lucide-react';
import { freelancerTheme } from '../src/app/theme/freelancerTheme';
import AuthSessionProvider from '../src/lib/context/auth-provider';
import { mockStorage } from '../src/lib/storage/mockStorage';
import { FreelancerHeader } from '../src/features/freelancer/components/FreelancerHeader';
import { FreelancerNav } from '../src/features/freelancer/components/FreelancerNav';
import '../src/index.css';
import '../src/features/freelancer/freelancer-home.css';
import './applications-prototype.css';

mockStorage.setActiveUser({ id:'minh-anh', name:'Minh Anh', email:'minhanh@example.test', role:'freelancer', actingIdentity:{type:'individual'}, verified:true });

const applications = [
  { id:'a1', title:'Bộ nhận diện cho Nắng Studio', company:'Nắng Studio', mark:'N', category:'Thiết kế thương hiệu', budget:'15-25 triệu', duration:'4 tuần', date:'18/10/2026', status:'offer', source:'Ứng tuyển', proposal:'Mình muốn xây dựng một hệ nhận diện linh hoạt, từ logo đến bao bì. Hai dự án Lúm Coffee và Mộc trong portfolio có phạm vi khá gần với brief này.' },
  { id:'a2', title:'Thiết kế landing page bộ sưu tập mới', company:'Mộc Concept', mark:'m.', category:'UI/UX & Website', budget:'12-18 triệu', duration:'3 tuần', date:'20/10/2026', status:'pending', source:'Ứng tuyển', proposal:'Mình đề xuất một landing page ưu tiên trải nghiệm trên điện thoại, làm nổi bật hình ảnh sản phẩm và câu chuyện của bộ sưu tập.' },
  { id:'a3', title:'Hình ảnh ra mắt thương hiệu cà phê', company:'Lúm Coffee', mark:'lúm', category:'Thiết kế thương hiệu', budget:'18-22 triệu', duration:'4 tuần', date:'17/10/2026', status:'discussing', source:'Từ lời mời', proposal:'Mình có thể phát triển hệ hình ảnh cho chiến dịch ra mắt, từ định hướng sáng tạo đến bộ thiết kế mạng xã hội.' },
  { id:'a4', title:'Bao bì cho dòng trà Cỏ Mây', company:'Cỏ Mây', mark:'cm', category:'Thiết kế bao bì', budget:'24 triệu', duration:'5 tuần', date:'28/09/2026', status:'selected', source:'Ứng tuyển', proposal:'Thiết kế hệ bao bì thống nhất cho ba vị trà, bao gồm minh họa và chuẩn bị tệp in.' },
];
const states = {
  offer:{label:'Chờ xác nhận', icon:FileText, hint:'Doanh nghiệp đã gửi thỏa thuận hợp tác.', action:'Xem thỏa thuận'},
  pending:{label:'Chờ xét duyệt', icon:Clock3, hint:'Chat sẽ mở khi doanh nghiệp duyệt hồ sơ.', action:'Xem hồ sơ'},
  discussing:{label:'Đang trao đổi', icon:MessageCircle, hint:'Hồ sơ đã được duyệt. Bạn có thể trao đổi.', action:'Mở trao đổi'},
  selected:{label:'Đã được chọn', icon:CircleCheck, hint:'Hai bên đã xác nhận hợp tác.', action:'Vào không gian làm việc'},
};
type Application = typeof applications[number];
function Preview(){
  const [active,setActive] = useState('a1');
  const [filter,setFilter] = useState('all');
  const [query,setQuery] = useState('');
  const [withdraw,setWithdraw] = useState(false);
  const [notice,setNotice] = useState('');
  const selected = applications.find(a=>a.id===active)!;
  const info = states[selected.status as keyof typeof states];
  const visible = applications.filter(a=>(filter==='all'||a.status===filter) && (a.title+' '+a.company).toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')));
  const detail = (app:Application)=>{setActive(app.id); document.getElementById('application-detail')?.scrollIntoView({block:'nearest'});};
  return <>
    <FreelancerHeader navigation={<FreelancerNav view="discover" onViewChange={()=>setNotice('Prototype: Khám phá dự án')} onUnavailable={setNotice}/>}/>
    <main className="applications-preview">
      <div className="preview-breadcrumb">Quản lý tìm việc <span>/</span> <strong>Việc làm đã ứng tuyển</strong></div>
      <div className="preview-heading"><div><h1>Quản lý ứng tuyển của bạn<span>.</span></h1><p>Theo dõi hồ sơ, tiếp tục trao đổi và nắm bắt cơ hội hợp tác.</p></div><Button variant="outlined" color="secondary" endIcon={<ArrowUpRight size={16}/>} onClick={()=>setNotice('Prototype: Khám phá dự án')}>Khám phá dự án</Button></div>
      <div className="preview-overview" aria-label="Tổng quan ứng tuyển">
        <div className="overview-total"><FileText size={22}/><strong>4</strong><span>hồ sơ đã gửi</span></div>
        <div><span className="mini-label">Chờ xét duyệt</span><strong>01</strong></div>
        <div><span className="mini-label">Đang trao đổi</span><strong>01</strong></div>
        <div className="needs-action"><span className="mini-label">Chờ bạn xác nhận</span><strong>01 <ArrowUpRight size={16}/></strong></div>
        <div><span className="mini-label">Đã được chọn</span><strong>01</strong></div>
      </div>
      <div className="preview-columns">
        <section className="preview-list" aria-label="Danh sách ứng tuyển">
          <div className="preview-tabs" role="tablist" aria-label="Lọc trạng thái">{[['all','Tất cả','4'],['pending','Chờ xét duyệt','1'],['discussing','Đang trao đổi','1'],['offer','Chờ xác nhận','1'],['selected','Đã được chọn','1']].map(([key,label,n])=><button key={key} role="tab" aria-selected={filter===key} className={filter===key?'is-active':''} onClick={()=>setFilter(key)}>{label}<span>{n}</span></button>)}</div>
          <div className="preview-toolbar"><label className="preview-search"><Search size={18}/><span className="sr-only">Tìm trong hồ sơ ứng tuyển</span><input placeholder="Tìm theo dự án, doanh nghiệp..." value={query} onChange={e=>setQuery(e.target.value)}/></label><button className="preview-sort" onClick={()=>setNotice('Prototype đang hiển thị hồ sơ cần xử lý trước')}>Cần xử lý trước <ChevronDown size={15}/></button></div>
          <div className="preview-results"><span><strong>{visible.length}</strong> hồ sơ ứng tuyển</span><span>Dữ liệu minh họa</span></div>
          <div className="preview-cards">{visible.map(app=>{const state=states[app.status as keyof typeof states]; const Icon=state.icon; return <article className={'application-card '+(app.id===active?'is-selected':'')} key={app.id}>
            <div className="application-top"><div className={'company-mark mark-'+app.id}>{app.mark}</div><div className="application-name"><span>{app.company} <span className="meta-separator">/</span> {app.category}</span><button onClick={()=>detail(app)}>{app.title}</button></div><Chip className={'application-status status-'+app.status} icon={<Icon size={13}/>} label={state.label} size="small"/></div>
            <div className="application-meta"><span><BriefcaseBusiness size={14}/><strong>{app.budget}</strong> / dự án</span><span><CalendarDays size={14}/>{app.duration}</span><span>Cá nhân</span><span>{app.source}</span><span className="submitted-date">Nộp {app.date}</span></div>
            <div className="application-bottom"><p>{app.status==='pending'?<LockKeyhole size={14}/>:<Icon size={14}/>}<span>{state.hint}</span></p><div>{app.status==='pending'&&<button className="withdraw-link" onClick={()=>setWithdraw(true)}>Rút hồ sơ</button>}<button className={'card-action '+(app.status==='offer'?'primary-action':'')} onClick={()=>detail(app)}>{state.action}<ArrowRight size={15}/></button></div></div>
          </article>})}</div>
          {!visible.length&&<div className="preview-empty"><Search size={26}/><h2>Không tìm thấy hồ sơ</h2><p>Thử từ khóa khác hoặc chọn lại trạng thái.</p><Button onClick={()=>{setFilter('all');setQuery('')}}>Xóa bộ lọc</Button></div>}
          <p className="preview-footnote"><LockKeyhole size={13}/>Hồ sơ và nội dung trao đổi chỉ hiển thị với doanh nghiệp của dự án.</p>
        </section>
        <aside className="preview-detail" id="application-detail">
          <div className="detail-topline"><h2>Hồ sơ ứng tuyển</h2><span>Cá nhân</span></div>
          <div className="detail-project"><span>{selected.company}</span><h3>{selected.title}</h3></div>
          {selected.status==='offer'&&<div className="detail-attention"><div><Clock3 size={16}/><strong>Thỏa thuận đang chờ bạn</strong></div><p>Xem điều khoản và phản hồi trước<br/><strong>24/10/2026, 17:00</strong>.</p><Button fullWidth variant="contained" endIcon={<ArrowRight size={15}/>} onClick={()=>setNotice('Prototype: Mở chi tiết thỏa thuận')}>Xem thỏa thuận</Button></div>}
          {selected.status!=='offer'&&<div className="detail-attention"><strong>{info.label}</strong><p>{info.hint}</p>{selected.status!=='pending'&&<Button fullWidth variant="contained" onClick={()=>setNotice('Prototype: '+info.action)}>{info.action}</Button>}</div>}
          <section className="detail-section"><h4>Tiến trình hồ sơ</h4><ol className="application-timeline"><li className="complete"><span><Check size={12}/></span><div><strong>Đã gửi hồ sơ</strong><small>{selected.date}</small></div></li><li className={selected.status==='pending'?'future':'complete'}><span>{selected.status==='pending'?<Clock3 size={12}/>:<Check size={12}/>}</span><div><strong>{selected.status==='pending'?'Chờ doanh nghiệp xét duyệt':'Đã duyệt, mở trao đổi'}</strong><small>{selected.status==='pending'?'Bạn sẽ nhận thông báo khi có phản hồi':'19/10/2026'}</small></div></li><li className={selected.status==='offer'?'current':'future'}><span><FileText size={12}/></span><div><strong>{selected.status==='selected'?'Đã xác nhận hợp tác':'Xác nhận thỏa thuận'}</strong><small>{selected.status==='offer'?'Đang chờ phản hồi của bạn':'Sau khi hai bên thống nhất'}</small></div></li></ol></section>
          <section className="detail-section proposal-section"><h4>Đề xuất của bạn</h4><p>{selected.proposal}</p></section>
          <section className="detail-section attachments-section"><h4>Tài liệu đã gửi</h4><div><div className="attachment-icon"><FileText size={19}/></div><div><strong>Portfolio cá nhân</strong><small>Lúm Coffee, Mộc Packaging</small></div><ArrowUpRight size={16}/></div></section>
          <button className="detail-project-link" onClick={()=>setNotice('Prototype: Mở chi tiết dự án')}>Xem chi tiết dự án <ArrowUpRight size={15}/></button>
        </aside>
      </div>
    </main>
    <Dialog open={withdraw} onClose={()=>setWithdraw(false)} maxWidth="xs" fullWidth><DialogTitle>Rút hồ sơ ứng tuyển?</DialogTitle><DialogContent>Doanh nghiệp sẽ không tiếp tục xét duyệt hồ sơ của bạn. Lịch sử ứng tuyển vẫn được lưu lại.</DialogContent><DialogActions><Button onClick={()=>setWithdraw(false)}>Giữ hồ sơ</Button><Button color="error" onClick={()=>{setWithdraw(false);setNotice('Prototype: Đã xác nhận thao tác rút hồ sơ')}}>Rút hồ sơ</Button></DialogActions></Dialog>
    {notice&&<button className="preview-toast" onClick={()=>setNotice('')}>{notice}<X size={15}/></button>}
  </>;
}
createRoot(document.getElementById('root')!).render(<ThemeProvider theme={freelancerTheme}><CssBaseline/><MemoryRouter initialEntries={['/freelancer/applications']}><AuthSessionProvider><Preview/></AuthSessionProvider></MemoryRouter></ThemeProvider>);
