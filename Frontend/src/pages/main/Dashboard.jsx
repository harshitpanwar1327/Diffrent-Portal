import React, {useState, useEffect} from 'react'
import './dashboard.css'
import {getCurrentDate} from '../../util/DateUtil'
import {decodeLicenseCodeWithToken} from '../../util/DecodeLicense'
import Chart from 'react-apexcharts'
import CountUp from 'react-countup'
import API from '../../util/Api'
import { ResponsivePie } from '@nivo/pie'
import One from '../../assets/dashboard/One.png'
import Two from '../../assets/dashboard/two.png'
import Three from '../../assets/dashboard/Three.png'
import Four from '../../assets/dashboard/Four.png'
import HashLoader from "react-spinners/HashLoader"

const MyPie = ({ data }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    innerRadius={0.5}
    padAngle={2}
    cornerRadius={5}
    activeOuterRadiusOffset={8}
    enableArcLinkLabels={false}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
    defs={[
      {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          size: 4,
          padding: 1,
          stagger: true
      },
      {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          rotation: -45,
          lineWidth: 6,
          spacing: 10
      }
    ]}
    fill={[
      {
          match: {
              id: 'ruby'
          },
          id: 'dots'
      },
      {
          match: {
              id: 'c'
          },
          id: 'dots'
      },
      {
          match: {
              id: 'go'
          },
          id: 'dots'
      },
      {
          match: {
              id: 'python'
          },
          id: 'dots'
      },
      {
          match: {
              id: 'scala'
          },
          id: 'lines'
      },
      {
          match: {
              id: 'lisp'
          },
          id: 'lines'
      },
      {
          match: {
              id: 'elixir'
          },
          id: 'lines'
      },
      {
          match: {
              id: 'javascript'
          },
          id: 'lines'
      }
    ]}
  />
)

const Dashboard = () => {
  let [totalDevices, setTotalDevices] = useState(0);
  let [activeLicense, setActiveLicense] = useState(0);
  let [healthyDevices, setHealthyDevices] = useState(0);
  let [retiredDevices, setRetiredDevices] = useState(0);
  let [groupData, setGroupData] = useState([]);
  let [licenseData, setLicenseData] = useState([]);
  let [loading, setLoading] = useState(false);

  const fetchDeviceCount = async () => {
    try {
      let response = await API.get("/devices/device-count/");
      setTotalDevices(response.data.data?.totalDevices[0].count);
      setHealthyDevices(response.data.data?.healthyDevices[0].count);
      setRetiredDevices(response.data.data?.retiredDevices[0].count);
      setGroupData(response.data.data?.groupData);
      setLicenseData(response.data.data?.licenseData);
    } catch (error) {
      console.log(error.response.data.message || error);
    }
  }

  const fetchLicenseCount = async () => {
    try {
      let response = await API.get("/license/get-license/");
      let licenseKeys = response.data.data;
      setActiveLicense(licenseKeys.filter((data) => {
        let licenseData = decodeLicenseCodeWithToken({licenseKey: data.licenseKey});
        let expiryDate = licenseData.expiryDate;
        return new Date(expiryDate) > new Date(getCurrentDate());
      }).length);
    } catch (error) {
      console.log(error.response.data.message || error);
    }
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      let loaderTimeout;

      try {
        loaderTimeout = setTimeout(() => setLoading(true), 1000);
        await fetchDeviceCount();
        await fetchLicenseCount();
      } catch (error) {
        console.log(error);
      } finally {
        clearTimeout(loaderTimeout);
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [])

  //Bar chart
  const bar = {
    series: [{
      name: 'Devices',
      data: groupData.map(data => data.count)
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      
      xaxis: {
        categories: groupData.map(data => data.groupName || 'null'),
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false
        }
      },
    },
  }

  return (
    <div className='main-page'>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <h2 className='dashboard-heading'>DASHBOARD</h2>
      <div className="dashboard-page">
        <div className="system-summary">
          <p className='dashboard-subheading'>SYSTEM SUMMARY</p>
          <div className="summary-boxes">
            <div className="total-devices">
              <img src={One} alt="icon" height={32}/>
              <h2><CountUp end={totalDevices} duration={2.5}/></h2>
              <p>Total Devices</p>
            </div>
            <div className="license-count">
              <img src={Two} alt="icon" height={32}/>
              <h2><CountUp end={activeLicense} duration={2.5}/></h2>
              <p>Active License</p>
            </div>
            <div className="healthy-devices">
              <img src={Three} alt="icon" height={32}/>
              <h2><CountUp end={healthyDevices} duration={2.5}/></h2>
              <p>Healthy Devices</p>
            </div>
            <div className="retired-devices">
              <img src={Four} alt="icon" height={32}/>
              <h2><CountUp end={retiredDevices} duration={2.5}/></h2>
              <p>Retired Devices</p>
            </div>
          </div>
        </div>

        <div className="bar-graph">
          <p className='dashboard-subheading'>DEVICE DISTRIBUTION BY GROUP</p>
          {groupData.length > 0 ? (
            <Chart options={bar.options} series={bar.series} type="bar" height={350} />
          ) : (
            <div className='no-data-message'>
              <p>No data available</p>
            </div>
          )}
        </div>

        <div className="pie-chart">
          <p className='dashboard-subheading'>DEVICE DISTRIBUTION BY LICENSE</p>
          {licenseData.length > 0 ? (
            <MyPie
              data={licenseData.map(data => ({
                id: data.licenseKey || 'Unknown',
                label: data.licenseKey || 'Unknown',
                value: data.count
              }))}
            />
          ) : (
            <div className='no-data-message'>
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;