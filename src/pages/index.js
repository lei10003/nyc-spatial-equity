import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { csv } from 'd3-fetch'
import { Roboto, Open_Sans } from 'next/font/google'

// const Map = dynamic(() => import("../components/map/Map"), { ssr: false });
const FlowMap = dynamic(() => import("../components/map/FlowMap"), { ssr: false });
const InjuriesMap = dynamic(() => import("../components/map/InjuriesMap"), { ssr: false });

const roboto = Open_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
})

export default function Home() {  
  const myRef = useRef(null);
  const newYorkCity = [40.7128, -74.006];
  const [minInjury, setMinInjury] = useState(10)
  const [data, setLineChartData] = useState([])

  const [selectedOption, setSelectedOption] = useState('Manhattan Bridge Bike Comprehensive');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const url = '/bikecount-month.csv';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    csv(url).then(chunk => {
      setLineChartData(chunk.filter(item => item.name === selectedOption).filter(item => +item.Year >= 2018 && +item.Year < 2023 ).map((d) => {
          return {
            name: d.name,
            total: +d.total,
            year: +d.Year,
            month: monthNames[d.Month - 1]
          }
      }))
    })
  }, [selectedOption])

  useEffect(() => {
    console.log(data)
  }, [data])

  // useEffect(() => {
  //   function handleScroll() {
  //     const targetRef = myRef.current;
  //     const topOffset = targetRef.offsetTop;
  //     const bottomOffset = topOffset + targetRef.clientHeight;
  //     const scrollPosition = window.pageYOffset + window.innerHeight;
  //     if (scrollPosition >= topOffset && scrollPosition < bottomOffset) {
  //       const map = targetRef.querySelector('.leaflet-container')._leaflet_map;
  //       map.flyTo(newYorkCity, 12, { duration: 2 });
  //       window.removeEventListener('scroll', handleScroll);
  //     }
  //   }

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  return (
    <main className="relative text-black" style={{}}>
      {/* <Map /> */}
      {/* LANDING SECTION */}
      <div className='relative'>
        <div className='w-full h-full z-0'>
          <img src="/img/landing1.png" style={{width: "100%", height: "100%"}} />
        </div>
        <div className='absolute top-96 left-0 bg-gray-100 text-black z-20 w-3/12 p-4'>
          <div className='font-bold text-4xl'>          
            Manhattan is the safest place to bike in NYC. What about the rest of New York?
          </div>
          <div className='text-normal font-serif'>
            Every time you hop on a bike in NYC, you're taking your life into your hands. But what if I told you that your risk of injury or even death can vary drastically based on where you live?
          </div>
        </div>
      </div>

      {/*   */}

      <div className='flex flex-col text-center my-6 h-max px-56'>
        <span className='font-light text-sm my-10 font-serif'>This study explores biking inequality in the city that never sleeps.</span>
        <div className='w-[8rem] h-full z-0 self-center rotate-180 opacity-50'>
          <img src="/img/Asset 2.svg" style={{width: "100%", height: "100%"}} />
        </div>
        <span className='font-light text-sm'>Scroll</span>
      </div>

      {/*  */}
      <div className='relative px-56'>
        <div className='relative h-max'>            
          <div className='relative z-0' style={{ width: "" }}>
            <img src="/img/nyc centerline_v2.png" style={{width: "100%", height: "100%"}} />
          </div>
          <div className='flex item-center justify-center'>
            <div className='absolute top-80 self-center bg-white z-10 p-4'>
              <span className='font-normal text-3xl'>
                Every day in 2022, <span className="font-extrabold">10 cyclists</span> were injured in NYC.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-56 mt-10">
        <span className='text-lg font-normal font-serif'>But the danger is not spread evenly across the city. When we look at the numbers by borough, we can see that some areas are far more hazardous for cyclists than others. In fact, one borough stands out as the most dangerous of all.</span>
      </div>
      <div className='my-20 px-56'>
        <div className=''>
          <img src="/img/cyclist injuries_capstone.png" style={{width: '100%', height: '100%'}}/>
        </div>
      </div>

      <div className='px-56 mt-10'>
        {/* <h1 className={`font-semibold text-4xl`} >Means of Transportation to Work for NYC Workers 16+</h1> */}
        {/* <div className='font-normal text-lg mt-5 font-serif'>
          <span>The American Journal of Public Health found that bike lanes can reduce the risk of injury by up to 90%. The study analyzed data from 12 US cities and found that bike lanes had a significant impact on reducing injury rates for cyclists.</span>
          <br />
          <span>The safety of cycling infrastructure can vary significantly across the five boroughs of New York City. While some areas boast well-maintained bike lanes and protected paths, others have few dedicated cycling spaces and higher rates of accidents. </span>
        </div> */}
      </div>

      <div className='px-[13.5rem]'>
        <h1 className='font-semibold text-6xl'>The Shape of Biking in NYC</h1>
        <div className='font-normal text-lg'>
          <span></span>
          {/* <br /> */}
        </div>
      </div>  

      <div className='px-56 mt-10'>
        <div className='font-normal text-lg mt-5 font-serif'>
          <span>The American Journal of Public Health found that bike lanes can reduce the risk of injury by up to 90%. The study analyzed data from 12 US cities and found that bike lanes had a significant impact on reducing injury rates for cyclists.</span>
          <br />
          <span>The safety of cycling infrastructure can vary significantly across the five boroughs of New York City. While some areas boast well-maintained bike lanes and protected paths, others have few dedicated cycling spaces and higher rates of accidents. </span>
        </div>
      </div>


      {/*  SunBurst Chart */}
      <div className='flex flex-row justify-between my-10 py-10 px-56 h-max'>
        <div className='w-6/12 space-y-4'>
          <h1 className='font-semibold text-4xl'>Distribution of Bike Lanes In NYC</h1>
          <div className='w-10/12 space-y-16'>
            <div className='font-normal text-2xl font-serif'>There are three types of bike lanes: Class I, Class II, and Class III.</div>
            <div className='flex flex-row gap-5 flex-wrap'>
              <div className='w-60'>
                <div className='absolute pl-4 font-medium'>Class 1</div>
                <img className='mt-4' src='/img/Class 1 Bike Lane.png' style={{width: '100%', height: '100%'}}></img>
              </div>
              <div className='w-60'>
                <div className='absolute pl-2 font-medium'>Class 2</div>
                <img className='mt-5' src='/img/Class 2 Bike Lane.png' style={{width: '100%', height: '100%'}}></img>
              </div>
              <div className='w-60'>
                <div className='absolute pl-4 font-medium'>Class 3</div>
                <img className='mt-4 -ml-2' src='/img/Class 3 Bike Lane.png' style={{width: '100%', height: '100%'}}></img>
              </div>
            </div>
            {/* <div className='font-light text-lg'>
              <span class="group relative">
                <span className='cursor-pointer'><b>Class I </b></span>
                <span class="group-hover:opacity-100 transition-opacity border bg-white px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
                -translate-x-1/2 translate-y-40 opacity-0 m-4 mx-auto z-10">

                </span>
              </span>
               bike lanes are physically separated from vehicular and pedestrian paths, while 
               <span class="group relative">
                <span className='cursor-pointer'><b> Class II </b></span>
                <span class="group-hover:opacity-100 transition-opacity border bg-white px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
                -translate-x-1/2 translate-y-32 opacity-0 m-4 mx-auto">
                  <div className='w-80'>
                    <img src='/img/Class 2 Bike Lane.png' style={{width: '100%', height: '100%'}}></img>
                  </div>
                </span>
              </span> 
               lanes are marked by paint and signage between a parking and traffic lane. 
               <span class="group relative">
                <span className='cursor-pointer'><b> Class III </b></span>
                <span class="group-hover:opacity-100 transition-opacity border bg-white px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
                -translate-x-1/2 translate-y-24 opacity-0 m-4 mx-auto">
                  <div className='w-80'>
                    <img src='/img/Class 3 Bike Lane.png' style={{width: '100%', height: '100%'}}></img>
                  </div>
                </span>
              </span> 
               lanes are shared vehicular/bike lanes, often marked by signage and shadows. Despite being the largest borough, Queens has a relatively low number of bike lanes compared to the other boroughs.
            </div> */}
          </div>
        </div>
        <div className='w-6/12'>
          <iframe 
            src='https://flo.uri.sh/visualisation/13502513/embed' 
            title='Interactive or visual content' 
            class='flourish-embed-iframe' 
            frameBorder='0' 
            scrolling='no' 
            style={{width: '100%', height: '800px'}} 
            sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'
          ></iframe>
        </div>
      </div>

      <div className='my-10 px-[13.5rem]'>
        <h1 className='font-semibold text-6xl'>Cycling Has Its Day</h1>
        <div className='font-normal text-lg pt-4 space-y-4 font-serif'>
          <p>The COVID-19 pandemic has led to a significant increase in cycling across the city. With concerns over the safety of enclosed public transportation, many residents have turned to cycling as a means of commuting.</p>
          {/* <br /> */}
        </div>
      </div>
      <div className='px-56 mt-14 font-serif'>
        <h1 className={`font-medium text-lg`}><b>Means of Transportation to Work for NYC Workers 16+</b></h1>
      </div>
      
      {/* US Census Data BarChart */}
      <div className='mb-10 mt-2 px-52'>
        {/* <a href='https://data.census.gov/table?q=commute&g=060XX00US3600508510,3604710022,3606144919,3608160323,3608570915_160XX00US3651000&tid=ACSST1Y2021.S0801' target='_blank'>
          <div>
            <img src="/img/waterfall-chart.png" style={{width: '100%', height: '100%'}}/>
          </div>
          <div className='w-72'>
            <img src="/img/waterfall-chart-axis.png" style={{width: '100%', height: '100%'}}/>
          </div>
        </a> */}
        <iframe 
          src='https://flo.uri.sh/visualisation/13517347/embed' 
          title='Interactive or visual content' 
          className='flourish-embed-iframe' 
          frameBorder='0' 
          scrolling='no' 
          style={{width: '100%', height: '800px'}} 
          sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>
      </div>

      <div className='my-10 px-[13.5rem]'>
        <div className='font-normal text-lg pt-4 space-y-4 font-serif'>
          <p>This shift has not only impacted commuting patterns, but also highlighted the need for further investment in cycling infrastructure to support this growing trend.</p>
          <p>Despite the surge in demand, investment in biking infrastructure has not been distributed equally across the five boroughs. This disparity in investment has resulted in some areas having safer and more convenient biking options than others, which can discourage cycling as a mode of transportation and put certain communities at a greater risk of accidents.</p> 
          <p>To gain insights into the cycling experience in the city, I will be analyzing data from Citibike, New York City's bike-sharing program. Citibike has been a popular transportation option for New Yorkers and visitors alike, providing a convenient and affordable way to navigate the city. With millions of trips taken every year, Citibike data provides a wealth of information on cycling patterns, usage, and rider demographics.</p>         
          {/* <br /> */}
        </div>
      </div>

      {/*  */}
      <div className='flex flex-col px-56 mt-20 space-x-28 maps-div h-[50rem] overflow-y-scroll'>
        <div className='h-[50rem]'>
          <div className='relative w-12/12'>
            <FlowMap />
          </div>
        </div>
        
        <div className='flex flex-col justify-center items-center mt-[55rem]'>
          <div className='w-[4rem] h-full z-0 self-center rotate-180 opacity-50'>
            <img src="/img/Asset 2.svg" style={{width: "100%", height: "100%"}} />
          </div>
          <span className='font-light text-sm'>Scroll</span>
        </div>
        <div className='flex flex-row h-[40rem] mt-[5rem]'>
          <div className='w-6/12 pt-60'>
            <div className='w-9/12'>
              <div className='font-normal text-lg font-serif'>
                However, as cycling in the city became more popular, the potential dangers of sharing the road with cars and other vehicles became increasingly apparent. Alongside the rise in cycling usage, the possibility of injury was a constant concern for many riders.
              </div>
              <div className='mt-10 font-thin text-sm font-serif'>
                Adjust the slider to view cycling trips and injury frequency by severity.
              </div>
              <div className='mt-5 relative w-max'>
                <input type="range" min="0" max="15" value={minInjury} className="range w-60" step="5" onChange={(e) => {
                  if(e.target.value == 0){
                    setMinInjury(1)
                  } else {
                    setMinInjury(e.target.value)                  
                  }
                }} />
                <div className="w-full flex justify-between text-xs px-2">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15+</span>
                </div>
              </div>
            </div>
          </div>
          <div className='relative w-6/12'>
            <InjuriesMap minInjury={minInjury} />
          </div>
        </div>
      </div>
      
      <div className='px-56 my-20'>
        <div className='font-semibold text-6xl'>
          The Biking Divide: Access to Safe Cycling Varies Across NYC
        </div>
        {/* <div className='mt-4 font-bold text-3xl'>
          Access to Safe Cycling Varies Across NYC
        </div> */}
        <div className='font-normal text-lg mt-5 font-serif'>
          In NYC only 13% of streets have bike lanes and out of these, only <span className='font-bold'>2% are protected</span>.
        </div>
      </div>

      <div className='px-56 my-20'>
        <iframe 
          src='https://flo.uri.sh/visualisation/13570858/embed' 
          title='Interactive or visual content' 
          className='flourish-embed-iframe' 
          frameBorder='0' 
          scrolling='no' 
          style={{width: '100%', height: '400px'}}
          sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'
        ></iframe>          
      </div>

      <div className='px-[13.5rem]'>
        {/* <h1 className='font-semibold text-6xl'>Socioeconomics of Bike Safety</h1> */}
        <div className='font-normal text-lg pt-4 space-y-4 font-serif'>
          <p>Understanding the factors that impact biking safety in New York City is crucial for improving the biking experience for all residents.</p>
          <p>The presence of bike lanes and other cycling infrastructure is a key factor in determining how safe and accessible biking is in different neighborhoods throughout the city. However, there are many other factors that come into play as well, such as traffic patterns, road design, and the behavior of drivers, pedestrians, and cyclists.</p>
          <p>Interestingly, our analysis found that neighborhoods with a higher percentage of white residents and higher median household incomes tended to have more protected and safe streets for bikers. This disparity in biking safety highlights the 
            <a href='https://pavementpieces.com/citi-bike-leaves-out-a-chunk-of-new-yorkers-including-those-most-in-need-of-a-ride/' target='_blank' className='text-blue-600'> ongoing issue of racial and economic inequality</a> in our city's infrastructure and its impact on the biking experience for residents. Addressing these disparities requires a multi-faceted approach that includes not only investing in biking infrastructure but also addressing systemic issues of inequality in our city. By prioritizing the safety and accessibility of biking for all New Yorkers, we can create a more equitable and sustainable city for generations to come.</p>
          {/* <br /> */}
        </div>
      </div>

      {/*  */}
      <div className='my-20 px-52'>
        <iframe src='https://flo.uri.sh/visualisation/13572734/embed' title='Interactive or visual content' class='flourish-embed-iframe' 
        frameBorder='0'
        scrolling='no'       
        style={{width: '100%', height: '800px'}}
        sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'
        ></iframe>
      </div>

      <div className='my-20 px-56'>
        <span className='font-normal text-lg font-serif'>Increasing biking safety and accessibility in New York City requires a concerted effort from policy makers, urban designers, community leaders, and residents alike. By prioritizing equitable access to safe biking infrastructure and addressing the underlying social and economic factors that impact biking safety, we can create a more vibrant, connected, and sustainable city for all. We urge city leaders to take action and make bold investments in biking infrastructure, and we encourage all residents to embrace the joys and benefits of cycling as a mode of transportation and recreation.</span>
      </div>
      <div className='h-96'></div>
      {/* <Image src={"/landing1.png"} width="1000" height="10  00"></Image> */}
      {/* <div className='w-72'>
        <select
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option value="">Select an option</option>
          <option value="Manhattan Bridge Bike Comprehensive">Manhattan Bridge Bike Comprehensive</option>
          <option value="Comprehensive Brooklyn Bridge Counter">Comprehensive Brooklyn Bridge Counter</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 12l-6-6h12l-6 6z"
            />
          </svg>
        </div>
      </div>
      <LineChart data={data} /> */}
      {/* <Map /> */}

      {/* <InjuriesMap minInjury={minInjury} /> */}
      {/* <div style={{background: "#D0D0D4" }} className='relative h-screen'>
        <div className=''>
          <InjuriesMap minInjury={minInjury} />
        </div>
        <div className='absolute top-80 h-max flex items-center justify-start z-20 pl-10'>
          <div className='text-left p-4 rounded-sm w-3/12' style={{background: "#F5F5F7", color: "#1D1D1F" }}>
            <span className=''>
              To gain insights into the cycling experience in the city, I will be analyzing data from Citibike, New York City's bike-sharing program. Citibike has been a popular transportation option for New Yorkers and visitors alike, providing a convenient and affordable way to navigate the city. With millions of trips taken every year, Citibike data provides a wealth of information on cycling patterns, usage, and rider demographics.
            </span>
            <div className='mt-5 relative'>
              <input type="range" min="0" max="15" value={minInjury} className="range" step="5" onChange={(e) => {
                if(e.target.value == 0){
                  setMinInjury(1)
                } else {
                  setMinInjury(e.target.value)                  
                }
              }} />
              <div className="w-full flex justify-between text-xs px-2">
                <span>1</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
              </div>
            </div>
          </div>
        </div> */}
      {/* </div> */}
      {/* // <div>
      //   <ConvexTreeMap />
      // </div> */}
    </main>
  )
}
