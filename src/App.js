import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import UserRegister from './pages/UserRegister';
import HostRegister from './pages/HostRegister';
import Admin from './pages/Admin';
import Host from './pages/Host';
import HostInfo from './pages/HostInfo';
import HostAddBranch from './pages/HostAddBranch';
import HostSchedule from './pages/HostSchedule';
import HostManage from './pages/HostManage';
import DetailHost from './pages/DetailHost';
import RoomBooking from './pages/RoomBooking';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';


function App() {
  return (
    <div>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={UserRegister} />
        <Route exact path="/host/register" component={HostRegister} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path={"/host/" + localStorage.getItem('username')} component={Host} />
        <Route exact path={"/host/" + localStorage.getItem('username') + "/personalinfo"} component={HostInfo} />
        <Route exact path={"/host/" + localStorage.getItem('username') + "/addbranch"} component={HostAddBranch} />
        <Route exact path={"/host/" + localStorage.getItem('username') + "/bookingschedule"} component={HostSchedule} />
        <Route exact path={"/host/" + localStorage.getItem('username') + "/manage"} component={HostManage} />
        <Route exact path="/rooms/book" component={RoomBooking} />
        <Route exact path="/rooms/:id" component={DetailHost} />
      </Switch>
    </Router>
    </div>
  );
}

export default App;