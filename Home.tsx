
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppLogo from './AppLogo';

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon?: string; className?: string }> = ({ title, children, icon, className = "" }) => (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6 ${className}`}>
        <h2 className="text-xl md:text-2xl font-bold text-brand-blue mb-4 flex items-center">
            {icon && <span className="mr-3 text-2xl md:text-3xl">{icon}</span>}
            {title}
        </h2>
        <div className="prose prose-sm md:prose-base max-w-none text-gray-700 space-y-3">
            {children}
        </div>
    </div>
);

// Updated Buildings List including split for Building 12
const BUILDINGS = ['อาคาร 10', 'อาคาร 11', 'อาคาร 4', '🔴 อาคาร 12 (โซน 1)', '🔵 อาคาร 12 (โซน 2)', 'อาคาร 9', 'อาคารนักกีฬา'];
const SCHEDULE_KEYS = ['b10', 'b11', 'b4', 'b12_1', 'b12_2', 'b9', 'sport'];

// Updated Schedule Data based on user request (1.2.23 + Update for Metira/Parichat)
const SCHEDULE_DATA = [
    {
        day: 'จันทร์',
        b10: 'รัศมิ์ภัชสรณ์',
        b11: 'อภิญญา',
        b4: 'ภคพร',
        b12_1: 'ภัทรกร',
        b12_2: 'อรรจน์ชนก',
        b9: 'นันทโชติ',
        sport: 'ฟานไลร์ อัญชลี'
    },
    {
        day: 'อังคาร',
        b10: 'มนรดา',
        b11: 'อภิญญา',
        b4: 'ณิชกมล',
        b12_1: 'กัลย์กมล',
        b12_2: 'อรรจน์ชนก',
        b9: 'สุพัดตรา',
        sport: 'ไอแซค'
    },
    {
        day: 'พุธ',
        b10: 'ณัฐพร',
        b11: 'ฐิติวรดา',
        b4: 'ณิชกมล',
        b12_1: 'ปริยาภัทร',
        b12_2: 'เคธี่',
        b9: 'ไอเเซค',
        sport: 'วรัญญู'
    },
    {
        day: 'พฤหัสฯ',
        b10: 'ขวัญหทัย',
        b11: 'รามิล',
        b4: 'วรัทยา',
        b12_1: 'ปริยาภัทร',
        b12_2: 'ณัฏฐากร',
        b9: 'นัณทวรรณ',
        sport: 'พรทิวา'
    },
    {
        day: 'ศุกร์',
        b10: 'ชุติมา',
        b11: 'เมธิรา',
        b4: 'อารดี',
        b12_1: 'สุพิชชา',
        b12_2: 'ศรัณยา',
        b9: 'ปาริชาติ',
        sport: 'เขมิกา'
    }
];

const garbageStaff = [
    "นายคมกฤษ เชิดในเมือง (ม.5/6)",
    "นายทินภัทร เจริญชล (ม.5/6)",
];

// --- Map Components ---

type RoomData = {
    code?: string;
    name?: string;
    type?: 'room' | 'stair' | 'gap' | 'void' | 'toilet';
    span?: number;
};

type FloorData = {
    name: string;
    rooms: RoomData[];
};

type BuildingConfig = {
    name: string;
    color: string;
    accentColor: string;
    floors: FloorData[];
};

const RoomCell: React.FC<RoomData & { color: string, variant?: 'default' | 'vertical-mobile' }> = ({ code, name, type = 'room', span = 1, color, variant = 'default' }) => {
    
    // Base classes for Horizontal (Desktop/Default)
    const horizontalClasses = {
        gap: "w-2 md:w-4 flex-shrink-0 bg-gray-300 mx-0.5 rounded-sm flex items-center justify-center",
        gapInner: "w-0.5 h-4 bg-gray-400/50",
        stair: "w-5 md:w-8 flex-shrink-0 bg-gray-400 mx-0.5 rounded-sm flex items-center justify-center text-[8px] md:text-[10px] text-white writing-vertical",
        void: "flex-1 min-w-[20px] md:min-w-[30px] bg-transparent mx-0.5",
        room: `flex-1 min-w-[36px] md:min-w-[44px] flex flex-col items-center justify-center p-0.5 border rounded shadow-sm mx-0.5 h-11 md:h-14 relative overflow-hidden ${color} border-black/10`
    };

    if (variant === 'vertical-mobile') {
         // Responsive classes: Mobile = Vertical Stack, Desktop = Horizontal
         if (type === 'gap') {
             return (
                 <div className="w-full h-2 md:w-4 md:h-auto bg-gray-300 my-1 md:my-0 md:mx-0.5 rounded-sm flex items-center justify-center">
                 </div>
             );
         }
         if (type === 'stair') {
             return (
                 <div className="w-full h-6 md:w-8 md:h-auto bg-gray-400 my-1 md:my-0 md:mx-0.5 rounded-sm flex items-center justify-center text-xs text-white md:writing-vertical">
                    บันได
                 </div>
             );
         }
         if (type === 'void') return <div className="hidden md:block md:flex-1 md:min-w-[30px] bg-transparent mx-0.5"></div>;

         return (
            <div 
                className={`w-full md:w-auto md:flex-1 h-10 md:h-14 flex flex-row md:flex-col items-center md:justify-center justify-between px-4 md:px-0.5 border rounded shadow-sm my-1 md:my-0 md:mx-0.5 relative overflow-hidden ${color} border-black/10`}
                style={{ flexGrow: span }}
            >
                <span className="font-bold text-gray-800 text-sm md:text-xs truncate">{code}</span>
                {name && <span className="text-xs md:text-[10px] text-gray-600 md:text-center truncate md:w-full text-right">{name}</span>}
            </div>
        );
    }

    // Default (Horizontal only - for Sport Building)
    if (type === 'gap') return <div className={horizontalClasses.gap}><div className={horizontalClasses.gapInner}></div></div>;
    if (type === 'stair') return <div className={horizontalClasses.stair}>บันได</div>;
    if (type === 'void') return <div className={horizontalClasses.void}></div>;
    
    return (
        <div 
            className={horizontalClasses.room}
            style={{ flexGrow: span }}
        >
            <span className="font-bold text-gray-800 text-[9px] md:text-xs leading-tight truncate w-full text-center">{code}</span>
            {name && <span className="text-[8px] md:text-[10px] text-gray-600 leading-tight text-center mt-0.5 truncate w-full">{name}</span>}
        </div>
    );
};

const DetailedBuildingMap: React.FC<BuildingConfig> = ({ name, color, accentColor, floors }) => {
    return (
        <div className={`rounded-xl overflow-hidden border-2 ${accentColor} bg-white shadow-md mb-6 break-inside-avoid`}>
            <div className={`${color} px-4 py-2 font-bold text-gray-800 text-center border-b ${accentColor}`}>
                {name}
            </div>
            {/* Remove overflow-x-auto on mobile since we stack vertically now */}
            <div className="p-2 md:p-3 space-y-4 md:overflow-x-auto">
                {floors.map((floor, i) => (
                    <div key={i} className="min-w-0 md:min-w-max">
                        <div className="text-xs font-semibold text-gray-500 mb-1 ml-1">{floor.name}</div>
                        
                        {/* Flex col on mobile, row on desktop */}
                        <div className="flex flex-col md:flex-row w-full">
                            {floor.rooms.map((room, j) => (
                                <RoomCell key={j} {...room} variant="vertical-mobile" color={room.type === 'toilet' ? 'bg-blue-100' : color.replace('bg-', 'bg-opacity-20 bg-')} />
                            ))}
                        </div>
                        
                        {/* Corridor: Hidden on mobile */}
                        <div className="hidden md:flex mt-1 h-4 border-t-2 border-dashed border-gray-300 w-full items-center justify-center">
                            <span className="text-[9px] text-gray-400 bg-white px-2 -mt-2.5">ทางเดิน</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MobileScheduleCard: React.FC<{ data: any, buildings: string[], keys: string[] }> = ({ data, buildings, keys }) => (
    <div className={`rounded-xl shadow-sm border p-4 mb-3 transition-all ${data.isToday ? 'bg-blue-50 border-brand-blue ring-1 ring-brand-blue/30 shadow-md transform scale-[1.01]' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100/50">
            <span className={`font-bold text-lg ${data.isToday ? 'text-brand-blue' : 'text-gray-700'}`}>{data.day}</span>
            {data.isToday && (
                <span className="bg-brand-blue text-white text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                    วันนี้
                </span>
            )}
        </div>
        <div className="space-y-2.5">
            {buildings.map((building, i) => (
                <div key={i} className="flex justify-between items-start text-sm">
                    <span className="text-gray-500 w-5/12 shrink-0 pr-2">{building}</span>
                    <span className="text-gray-800 font-medium text-right w-7/12 break-words">{data[keys[i]]}</span>
                </div>
            ))}
        </div>
    </div>
);


// --- Building Data ---

const buildingsData: BuildingConfig[] = [
    {
        name: "อาคาร 11",
        color: "bg-yellow-200",
        accentColor: "border-yellow-400",
        floors: [
            {
                name: "ชั้น 2",
                rooms: [
                    { code: "1114", name: "1/3" }, { code: "1113", name: "1/4" }, { code: "1112", name: "1/5" }, { code: "1111", name: "1/6" }
                ]
            },
            {
                name: "ชั้น 1",
                rooms: [
                    { code: "1104", name: "1/7" }, { code: "1103", name: "1/8" }, { code: "1102", name: "to be" }, { code: "1101", name: "พยาบาล" }
                ]
            }
        ]
    },
    {
        name: "อาคาร 10",
        color: "bg-orange-200",
        accentColor: "border-orange-400",
        floors: [
            {
                name: "ชั้น 3",
                rooms: [
                    { code: "1023", name: "3/5" }, { code: "1022", name: "3/4" }, { code: "1021", name: "3/3" }, { type: 'stair' }
                ]
            },
            {
                name: "ชั้น 2",
                rooms: [
                    { code: "1013", name: "6/6" }, { code: "1012", name: "5/6" }, { code: "1011", name: "4/6" }, { type: 'stair' }
                ]
            },
            {
                name: "ชั้น 1",
                rooms: [
                    { code: "1003", name: "บท" }, { code: "1002", name: "สภา" }, { code: "1001", name: "กิจการ" }, { type: 'stair' }
                ]
            }
        ]
    },
    {
        name: "อาคาร 9",
        color: "bg-pink-200",
        accentColor: "border-pink-400",
        floors: [
            {
                name: "ชั้น 2",
                rooms: [
                    { code: "928", name: "Eng" }, { code: "927", name: "1/2" },
                    { type: 'gap' },
                    { code: "926", name: "2/2" }, { code: "925", name: "3/2" }, { code: "924", name: "" }, { code: "923", name: "คอม" },
                    { type: 'gap' },
                    { code: "922", name: "วิชาการ" }, { code: "921", name: "งบ" }
                ]
            },
            {
                name: "ชั้น 1",
                rooms: [
                    { code: "918", name: "" }, { code: "917", name: "คณิต" },
                    { type: 'gap' },
                    { code: "916", name: "" }, { code: "915", name: "คอม" }, { code: "914", name: "บุคคล" }, { code: "913", name: "คอม" },
                    { type: 'gap' },
                    { code: "912", name: "" }, { code: "911", name: "โสต" }
                ]
            },
            {
                name: "ใต้ถุน",
                rooms: [
                    { code: "908", name: "" }, { code: "907", name: "" },
                    { type: 'gap' },
                    { code: "906", name: "" }, { code: "905", name: "" }, { code: "904", name: "" }, { code: "903", name: "" },
                    { type: 'gap' },
                    { code: "902", name: "" }, { code: "901", name: "" }
                ]
            }
        ]
    },
    {
        name: "อาคาร 4",
        color: "bg-green-200",
        accentColor: "border-green-400",
        floors: [
            {
                name: "ชั้น 2",
                rooms: [
                    { code: "428", name: "" }, { code: "427", name: "อาเซียน" },
                    { type: 'gap' },
                    { code: "426", name: "2/5" }, { code: "425", name: "2/4" }, { code: "424", name: "2/3" }, { code: "423", name: "1/9" },
                    { type: 'gap' },
                    { code: "422", name: "1/10" }, { code: "421", name: "" }
                ]
            },
            {
                name: "ชั้น 1",
                rooms: [
                    { code: "418", name: "" }, { code: "417", name: "2/10" },
                    { type: 'gap' },
                    { code: "416", name: "2/9" }, { code: "415", name: "2/8" }, { code: "414", name: "2/7" }, { code: "413", name: "2/6" },
                    { type: 'gap' },
                    { code: "412", name: "วิทย์" }, { code: "411", name: "ชีวะ" }
                ]
            },
            {
                name: "ใต้ถุน",
                rooms: [
                    { code: "408", name: "พละ" }, { code: "407", name: "กิจการ" },
                    { type: 'gap' },
                    { code: "406", name: "" }, { code: "405", name: "" }, { code: "404", name: "" }, { code: "403", name: "" },
                    { type: 'gap' },
                    { code: "402", name: "พัสดุ" }, { code: "401", name: "แนะแนว" }
                ]
            }
        ]
    },
    {
        name: "อาคาร 12",
        color: "bg-purple-200",
        accentColor: "border-purple-400",
        floors: [
            {
                name: "ชั้น 4",
                rooms: [
                    { code: "1238", name: "eng" },
                    { type: 'gap' },
                    { code: "1237", name: "4/4" }, { code: "1236", name: "4/5" }, { code: "1235", name: "6/5" }, { code: "1234", name: "6/4" }, { code: "1233", name: "6/3" }, { code: "1232", name: "6/2" },
                    { type: 'gap' },
                    { code: "1231", name: "คอม" }
                ]
            },
            {
                name: "ชั้น 3",
                rooms: [
                    { code: "1228", name: "วิทย์" },
                    { type: 'gap' },
                    { code: "1227", name: "4/2" }, { code: "1226", name: "4/3" }, { code: "1225", name: "5/5" }, { code: "1224", name: "5/4" }, { code: "1223", name: "5/3" }, { code: "1222", name: "5/2" },
                    { type: 'gap' },
                    { code: "1221", name: "วิทย์" }
                ]
            },
            {
                name: "ชั้น 2",
                rooms: [
                    { code: "1218", name: "ห้องน้ำ", type: 'toilet' },
                    { type: 'gap' },
                    { code: "1217", name: "6/1" }, { code: "1216", name: "5/1" }, { code: "1215", name: "4/1" }, { code: "1214", name: "3/1" }, { code: "1213", name: "2/1" }, { code: "1212", name: "1/1" },
                    { type: 'gap' },
                    { code: "1211", name: "พักครู" }, { code: "", name: "ห้องน้ำ", type: 'toilet' }
                ]
            }
        ]
    }
];

const SportBuildingMap = () => (
    <div className="rounded-xl overflow-hidden border-2 border-blue-400 bg-white shadow-md mb-6 break-inside-avoid">
        <div className="bg-blue-200 px-4 py-2 font-bold text-gray-800 text-center border-b border-blue-400">
            อาคารนักกีฬา
        </div>
        <div className="p-2 md:p-3 overflow-x-auto">
            <div className="min-w-max">
                <div className="flex w-full mb-2">
                     <div className="flex-1 bg-transparent"></div> {/* Gap */}
                     <RoomCell code="ก2" name="3/8" color="bg-blue-50" />
                     <RoomCell code="ก3" name="3/7" color="bg-blue-50" />
                     <RoomCell code="ก4" name="3/6" color="bg-blue-50" />
                     <RoomCell code="ก5" name="สมุด" color="bg-blue-50" />
                </div>
                <div className="flex w-full">
                     <RoomCell code="ก1" name="3/9" color="bg-blue-50" />
                     <div className="flex-grow-[2] mx-1"></div> {/* Large gap */}
                     <RoomCell code="ก6" name="ห้องสมุด" color="bg-blue-50" />
                </div>
            </div>
        </div>
    </div>
);

const BackgroundWallpaper = () => {
    // Use a long string of the 5S words repeated to ensure seamless looping
    const text = "สะสาง สะดวก สะอาด สุขลักษณะ สร้างนิสัย ";
    // Create a very long string to cover wide screens before wrapping
    const repeatedText = Array(20).fill(text).join(" • ");
  
    return (
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <style>
              {`
              @keyframes marquee-left {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
              }
              @keyframes marquee-right {
                  0% { transform: translateX(-50%); }
                  100% { transform: translateX(0); }
              }
              `}
          </style>
          {/* Container is rotated and scaled up to cover the corners */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] flex flex-col justify-center gap-16 transform -rotate-12 opacity-[0.03]">
              {/* Render multiple rows */}
              {[...Array(20)].map((_, i) => (
                  <div 
                      key={i} 
                      className="whitespace-nowrap text-6xl font-black text-brand-blue"
                      style={{ 
                          // Alternate direction and vary speed slightly
                          animation: `${i % 2 === 0 ? 'marquee-left' : 'marquee-right'} ${40 + (i % 3) * 10}s linear infinite`
                      }}
                  >
                      {/* Render text twice to allow for seamless -50% translate loop */}
                      <span>{repeatedText}</span>
                      <span>{repeatedText}</span>
                  </div>
              ))}
          </div>
      </div>
    );
};

const Home: React.FC = () => {
    // Logic to determine today and highlight it
    const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสฯ', 'ศุกร์', 'เสาร์'];
    // Map standard date index to our day strings. Note: SCHEDULE_DATA uses 'พฤหัสฯ' for Thursday.
    const todayName = todayIndex === 4 ? 'พฤหัสฯ' : days[todayIndex];

    const scheduleWithToday = useMemo(() => {
        return SCHEDULE_DATA.map(s => ({
            ...s,
            isToday: s.day === todayName
        }));
    }, [todayName]);

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 overflow-hidden">
            <BackgroundWallpaper />
            <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8">
                <header className="text-center space-y-4">
                    <AppLogo className="w-32 h-32 md:w-40 md:h-40 mx-auto" />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-blue-light">
                        โครงการ 5ส โรงเรียนเกาะสมุย
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        ส่งเสริมสภาพแวดล้อมที่สะอาด เป็นระเบียบ เอื้อต่อการเรียนรู้ และสร้างวินัยที่ดีให้แก่นักเรียน
                    </p>
                    <Link to="/login" className="inline-block bg-brand-blue text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-blue-light transition-transform transform hover:scale-105 shadow-lg">
                        เข้าสู่ระบบ
                    </Link>
                </header>

                <main className="space-y-8">
                    <InfoCard title="ที่มาโครงการ" icon="📘">
                        <p>
                            โครงการ 5ส โรงเรียนเกาะสมุย จัดทำขึ้นเพื่อส่งเสริมให้สถานศึกษาเป็นสภาพแวดล้อมที่สะอาดเป็นระเบียบ เอื้อต่อการเรียนรู้ และสร้างวินัยที่ดีให้แก่นักเรียน ตามหลักการ 5ส ได้แก่ สะสาง สะดวก สะอาด สุขลักษณะ และสร้างนิสัย
                        </p>
                        <p>
                            โครงการนี้มีวัตถุประสงค์เพื่อพัฒนาพื้นที่ภายในโรงเรียน ห้องเรียน และจุดใช้สอยต่าง ๆ ให้เกิดความเรียบร้อยยั่งยืน พร้อมปลูกฝังความรับผิดชอบ ความมีระเบียบวินัย และการมีส่วนร่วมของนักเรียนในทุกระดับชั้น
                        </p>
                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-brand-blue">
                            <p className="font-semibold">การดำเนินงานอยู่ภายใต้การกำกับดูแลของ:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><strong>ผู้อำนวยการโครงการ:</strong> นายปฏิพัทธ์ ใจดี (รองผู้อำนวยการสถานศึกษากลุ่มบริหารทั่วไป)</li>
                                <li><strong>ผู้รับผิดชอบโครงการ:</strong> คุณครูภานุวัฒน์ ทองจันทร์</li>
                                <li><strong>ที่ปรึกษาโครงการ:</strong> คุณครูมัลลิกา ไชยวิก (ครูผู้ดูแลงานสภานักเรียน)</li>
                            </ul>
                        </div>
                    </InfoCard>
                    
                    {/* New Map Section */}
                    <div className="grid gap-6">
                        <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2 px-2">
                            <span className="text-3xl">🗺️</span> ผังอาคารเรียน
                        </h2>
                        
                        {/* Map Container - Masonry-ish layout for desktop */}
                        <div className="columns-1 lg:columns-2 gap-6 space-y-6">
                            {/* Render Standard Buildings */}
                            {buildingsData.map((building, i) => (
                                <DetailedBuildingMap key={i} {...building} />
                            ))}
                            {/* Render Sport Building */}
                            <SportBuildingMap />
                        </div>
                    </div>

                    <InfoCard title="ตารางเวรเจ้าหน้าที่ 5ส" icon="👥" className="overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto pb-4">
                            <table className="w-full min-w-[900px] border-collapse bg-white rounded-lg overflow-hidden shadow-sm text-sm md:text-base">
                                <thead>
                                    <tr className="bg-brand-blue text-white">
                                        <th className="py-3 px-4 text-left font-semibold border-b border-brand-blue-light/30 sticky left-0 bg-brand-blue z-10 w-24">วัน / อาคาร</th>
                                        {BUILDINGS.map((building, i) => (
                                            <th key={i} className="py-3 px-4 text-center font-semibold border-b border-brand-blue-light/30 whitespace-nowrap">
                                                {building}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {scheduleWithToday.map((row, index) => (
                                        <tr key={index} className={`border-b border-gray-100 transition-colors ${row.isToday ? 'bg-blue-50 ring-inset ring-2 ring-brand-blue/30' : (index % 2 === 0 ? 'bg-gray-50/50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50')}`}>
                                            <td className="py-3 px-4 font-bold text-brand-blue border-r border-gray-100 sticky left-0 bg-inherit z-10 flex items-center justify-between">
                                                {row.day}
                                                {row.isToday && <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" title="วันนี้"></span>}
                                            </td>
                                            <td className="py-3 px-2 text-center border-r border-gray-100 text-gray-700">{row.b10}</td>
                                            <td className="py-3 px-2 text-center border-r border-gray-100 text-gray-700">{row.b11}</td>
                                            <td className="py-3 px-2 text-center border-r border-gray-100 text-gray-700">{row.b4}</td>
                                            <td className="py-3 px-2 text-center border-r border-gray-100 text-gray-700">{row.b12_1}</td>
                                            <td className="py-3 px-2 text-center border-r border-gray-100 text-gray-700">{row.b12_2}</td>
                                            <td className="py-3 px-2 text-center border-r border-gray-100 text-gray-700">{row.b9}</td>
                                            <td className="py-3 px-2 text-center text-gray-700">{row.sport}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {scheduleWithToday.map((row, i) => (
                                <MobileScheduleCard key={i} data={row} buildings={BUILDINGS} keys={SCHEDULE_KEYS} />
                            ))}
                        </div>

                        <div className="mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                เจ้าหน้าที่ดูแลห้องขยะ
                            </h4>
                            <ul className="list-none space-y-1 text-gray-700 ml-7">
                                {garbageStaff.map((staff, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                        {staff}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </InfoCard>
                    
                    <InfoCard title="ขอบเขตงานของโครงการ" icon="📋">
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>การจัดระบบ 5ส ภายในโรงเรียน:</strong> วางแผน จัดพื้นที่ ตรวจสอบและประเมินตามหลัก 5ส</li>
                            <li><strong>การตรวจประเมินห้องเรียนรายวัน:</strong> ตรวจความสะอาด ความเรียบร้อย การจัดเก็บสิ่งของ และสภาพห้องเรียน</li>
                            <li><strong>การจัดระบบการลดขยะและดูแลพื้นที่เก็บขยะ:</strong> ดูแลจุดทิ้งขยะ คัดแยกขยะ และดูแลความสะอาดบริเวณถังขยะ</li>
                            <li><strong>การส่งเสริมการมีส่วนร่วมของนักเรียน:</strong> เปิดรับนักเรียนที่สนใจร่วมเป็นเจ้าหน้าที่ 5ส ปลูกฝังวินัย และการทำงานเป็นทีม</li>
                            <li><strong>การรายงานผลโครงการต่อฝ่ายบริหาร:</strong> สรุปผลเป็นรายสัปดาห์ รายเดือน และรายภาคเรียน</li>
                        </ul>
                    </InfoCard>

                </main>
            </div>
        </div>
    );
};

export default Home;
