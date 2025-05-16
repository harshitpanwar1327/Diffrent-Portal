import React, {useState, useEffect} from 'react'
import './dashboard.css'
import {getCurrentDate} from '../../util/DateUtil'
import {decodeLicenseCodeWithToken} from '../../util/DecodeLicense'
import Chart from 'react-apexcharts'
import CountUp from 'react-countup'
import API from '../../util/Api'

const Dashboard = () => {
  let [totalDevices, setTotalDevices] = useState(0);
  let [activeLicense, setActiveLicense] = useState(0);
  let [healthyDevices, setHealthyDevices] = useState(0);
  let [retiredDevices, setRetiredDevices] = useState(0);
  let [groupData, setGroupData] = useState([]);
  let [licenseData, setLicenseData] = useState([]);

  useEffect(() => {
    const fetchDeviceCount = async () => {
      try {
        let response = await API.get("/devices/device-count/");
        setTotalDevices(response.data.data?.totalDevices[0].count);
        setHealthyDevices(response.data.data?.healthyDevices[0].count);
        setRetiredDevices(response.data.data?.retiredDevices[0].count);
        setGroupData(response.data.data?.groupData);
        setLicenseData(response.data.data?.licenseData);
      } catch (error) {
        console.log(error);
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
        console.log(error);
      }
    }

    fetchDeviceCount();
    fetchLicenseCount();
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
        categories: groupData.map(data => data.groupID || 'null'),
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

  //Pie Chart
  const pie = {
    series: licenseData.map((data) => data.count),
    options: {
      chart: {
        type: 'donut',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          },
        }
      }],
      labels: licenseData.map(data => data.licenseKey?.slice(0,12) || 'null')
    },
  }

  return (
    <div className='mainPages'>
      <h2 className='dashboard-heading'>DASHBOARD</h2>
      <div className="dashboardPage">
        <div className="system-summary">
          <p className='dashboard-subheading'>SYSTEM SUMMARY</p>
          <div className="summary-boxes">
            <div className="total-devices">
              <p>Total Devices</p>
              <h2><CountUp end={totalDevices} duration={2.5}/></h2>
            </div>
            <div className="license-count">
              <p>Active License</p>
              <h2><CountUp end={activeLicense} duration={2.5}/></h2>
            </div>
            <div className="healthy-devices">
              <p>Healthy Devices</p>
              <h2><CountUp end={healthyDevices} duration={2.5}/></h2>
            </div>
            <div className="retired-devices">
              <p>Retired Devices</p>
              <h2><CountUp end={retiredDevices} duration={2.5}/></h2>
            </div>
          </div>
        </div>

        <div className="bar-graph">
          <p className='dashboard-subheading'>DEVICE DISTRIBUTION BY GROUP</p>
          <Chart options={bar.options} series={bar.series} type="bar" height={350} />
        </div>

        <div className="pie-chart">
          <p className='dashboard-subheading'>DEVICE DISTRIBUTION BY LICENSE</p>
          <Chart key={licenseData.length} options={pie.options} series={pie.series} type="donut" height={1000}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;