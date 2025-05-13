    'use client';

    import { useState } from 'react';
    import { Card, CardContent } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import AnimatedBackground from "@/components/animated-background";
    import Image from 'next/image';
    import { ScrollText } from 'lucide-react';
    import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
    import { useWallet } from '@solana/wallet-adapter-react';
    import { TransactionModal } from '@/components/TransactionModal';
    import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

    interface TeamInfo {
    name: string;
    shortname: string;
    img: string;
    }

    interface Match {
    id: string;
    name: string;
    matchType: string;
    status: string;
    venue: string;
    date: string;
    dateTimeGMT: string;
    teams: string[];
    teamInfo: TeamInfo[];
    score?: {
        r: number;
        w: number;
        o: number;
        inning: string;
    }[];
    series_id: string;
    fantasyEnabled: boolean;
    bbbEnabled: boolean;
    hasSquad: boolean;
    matchStarted: boolean;
    matchEnded: boolean;
    }
    const matchesData = {
    data: {
        "apikey": "4a356387-ac94-46c9-ba12-2c38674edb8c",
        "data": [
        {
            "id": "ecfee815-3f76-4af5-8403-74b0b6c900e8",
            "name": "Scotland vs Netherlands, 67th Match",
            "matchType": "odi",
            "status": "Match not started",
            "venue": "SV Kampong CC, Kampong, Utrecht",
            "date": "2025-05-16",
            "dateTimeGMT": "2025-05-16T09:00:00",
            "teams": [
            "Scotland",
            "Netherlands"
            ],
            "teamInfo": [
            {
                "name": "Netherlands",
                "shortname": "NED",
                "img": "https://g.cricapi.com/iapi/55-637877084465746618.webp?w=48"
            },
            {
                "name": "Scotland",
                "shortname": "SCO",
                "img": "https://g.cricapi.com/iapi/79-637877081763746652.webp?w=48"
            }
            ],
            "series_id": "9b836620-68cb-4798-9647-d479aa871b76",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": true,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "79836368-125a-433f-9329-3b3df4423f45",
            "name": "Estonia Women vs Bulgaria Women, 3rd T20I",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "Estonian National Cricket and Rugby Field, Tallinn",
            "date": "2025-05-16",
            "dateTimeGMT": "2025-05-16T06:30:00",
            "teams": [
            "Estonia Women",
            "Bulgaria Women"
            ],
            "teamInfo": [
            {
                "name": "Bulgaria Women",
                "shortname": "BW",
                "img": "https://h.cricapi.com/img/icon512.png"
            },
            {
                "name": "Estonia Women",
                "shortname": "EW",
                "img": "https://g.cricapi.com/iapi/601-637876983045042040.webp?w=48"
            }
            ],
            "series_id": "9334b089-75cf-40c7-b000-43ecfa5d9f36",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": false,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "59fbb266-f132-469f-a7db-3ae345825ce4",
            "name": "Estonia Women vs Bulgaria Women, 2nd T20I",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "Estonian National Cricket and Rugby Field, Tallinn",
            "date": "2025-05-15",
            "dateTimeGMT": "2025-05-15T10:45:00",
            "teams": [
            "Estonia Women",
            "Bulgaria Women"
            ],
            "teamInfo": [
            {
                "name": "Bulgaria Women",
                "shortname": "BW",
                "img": "https://h.cricapi.com/img/icon512.png"
            },
            {
                "name": "Estonia Women",
                "shortname": "EW",
                "img": "https://g.cricapi.com/iapi/601-637876983045042040.webp?w=48"
            }
            ],
            "series_id": "9334b089-75cf-40c7-b000-43ecfa5d9f36",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": false,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "3a54bb7e-48c7-49b2-a573-5af873cd86d5",
            "name": "Estonia Women vs Bulgaria Women, 1st T20I",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "Estonian National Cricket and Rugby Field, Tallinn",
            "date": "2025-05-15",
            "dateTimeGMT": "2025-05-15T06:30:00",
            "teams": [
            "Estonia Women",
            "Bulgaria Women"
            ],
            "teamInfo": [
            {
                "name": "Bulgaria Women",
                "shortname": "BW",
                "img": "https://h.cricapi.com/img/icon512.png"
            },
            {
                "name": "Estonia Women",
                "shortname": "EW",
                "img": "https://g.cricapi.com/iapi/601-637876983045042040.webp?w=48"
            }
            ],
            "series_id": "9334b089-75cf-40c7-b000-43ecfa5d9f36",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": false,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "43494c74-9065-4ef6-900f-282e5aea6f86",
            "name": "United Arab Emirates vs Scotland, 66th Match",
            "matchType": "odi",
            "status": "Match not started",
            "venue": "SV Kampong CC, Kampong, Utrecht",
            "date": "2025-05-14",
            "dateTimeGMT": "2025-05-14T09:00:00",
            "teams": [
            "United Arab Emirates",
            "Scotland"
            ],
            "teamInfo": [
            {
                "name": "Scotland",
                "shortname": "SCO",
                "img": "https://g.cricapi.com/iapi/79-637877081763746652.webp?w=48"
            },
            {
                "name": "United Arab Emirates",
                "shortname": "UAE",
                "img": "https://g.cricapi.com/iapi/92-637877081068315608.webp?w=48"
            }
            ],
            "series_id": "9b836620-68cb-4798-9647-d479aa871b76",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": true,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "1c596157-edbf-4193-81b6-5f943b836d89",
            "name": "Japan vs Cook Islands, 2nd T20I",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "Sano International Cricket Ground, Sano, Kanto",
            "date": "2025-05-14",
            "dateTimeGMT": "2025-05-14T02:00:00",
            "teams": [
            "Japan",
            "Cook Islands"
            ],
            "teamInfo": [
            {
                "name": "Cook Islands",
                "shortname": "COI",
                "img": "https://g.cricapi.com/iapi/2342-637987698055825091.webp?w=48"
            },
            {
                "name": "Japan",
                "shortname": "JPN",
                "img": "https://g.cricapi.com/iapi/618-637928917609353191.png?w=48"
            }
            ],
            "series_id": "c20d0b43-3cb1-4fa7-90f7-352828531f17",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": false,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "02cc1905-4270-43d5-915d-a2e0c065945f",
            "name": "Japan vs Cook Islands, 1st T20I",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "Sano International Cricket Ground, Sano, Kanto",
            "date": "2025-05-13",
            "dateTimeGMT": "2025-05-13T02:00:00",
            "teams": [
            "Japan",
            "Cook Islands"
            ],
            "teamInfo": [
            {
                "name": "Cook Islands",
                "shortname": "COI",
                "img": "https://g.cricapi.com/iapi/2342-637987698055825091.webp?w=48"
            },
            {
                "name": "Japan",
                "shortname": "JPN",
                "img": "https://g.cricapi.com/iapi/618-637928917609353191.png?w=48"
            }
            ],
            "series_id": "c20d0b43-3cb1-4fa7-90f7-352828531f17",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": false,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "1e323731-5681-4321-902a-2d28dca5a61d",
            "name": "United Arab Emirates vs Netherlands, 65th Match",
            "matchType": "odi",
            "status": "Match not started",
            "venue": "SV Kampong CC, Kampong, Utrecht",
            "date": "2025-05-12",
            "dateTimeGMT": "2025-05-12T09:00:00",
            "teams": [
            "United Arab Emirates",
            "Netherlands"
            ],
            "teamInfo": [
            {
                "name": "Netherlands",
                "shortname": "NED",
                "img": "https://g.cricapi.com/iapi/55-637877084465746618.webp?w=48"
            },
            {
                "name": "United Arab Emirates",
                "shortname": "UAE",
                "img": "https://g.cricapi.com/iapi/92-637877081068315608.webp?w=48"
            }
            ],
            "series_id": "9b836620-68cb-4798-9647-d479aa871b76",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": true,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "3df8dddc-8ef1-400e-8da1-ef8f9fbc139b",
            "name": "Japan vs Thailand, Final",
            "matchType": "t20",
            "status": "Thailand won by 6 wkts",
            "venue": "Sano International Cricket Ground, Sano, Kanto",
            "date": "2025-05-11",
            "dateTimeGMT": "2025-05-11T00:30:00",
            "teams": [
            "Japan",
            "Thailand"
            ],
            "teamInfo": [
            {
                "name": "Japan",
                "shortname": "JPN",
                "img": "https://g.cricapi.com/iapi/618-637928917609353191.png?w=48"
            },
            {
                "name": "Thailand",
                "shortname": "THAI",
                "img": "https://g.cricapi.com/iapi/661-637873698140793668.webp?w=48"
            }
            ],
            "score": [
            {
                "r": 106,
                "w": 8,
                "o": 20,
                "inning": "Japan Inning 1"
            },
            {
                "r": 109,
                "w": 4,
                "o": 19.5,
                "inning": "Thailand Inning 1"
            }
            ],
            "series_id": "d7f39636-282f-4b75-81da-1570aa9734e6",
            "fantasyEnabled": true,
            "bbbEnabled": true,
            "hasSquad": true,
            "matchStarted": true,
            "matchEnded": true
        },
        
    
            
        {
            "id": "bf778220-a4f5-4401-90a8-f98dda77c6fb",
            "name": "Hong Kong Women vs Bahrain Women, 17th Match",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "TBC, TBC",
            "date": "2025-05-16",
            "dateTimeGMT": "2025-05-16T02:30:00",
            "teams": [
            "Hong Kong Women",
            "Bahrain Women"
            ],
            "teamInfo": [
            {
                "name": "Bahrain Women",
                "shortname": "BAH-W",
                "img": "https://g.cricapi.com/iapi/1597-637926302418123133.webp?w=48"
            },
            {
                "name": "Hong Kong Women",
                "shortname": "HKGW",
                "img": "https://g.cricapi.com/iapi/1123-637877089446450033.webp?w=48"
            }
            ],
            "series_id": "d98be13e-3b73-4858-99f3-b58c7131704b",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": true,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "551f20bf-cff6-4288-8e90-d243521acba2",
            "name": "United Arab Emirates Women vs Qatar Women, 15th Match",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "TBC, TBC",
            "date": "2025-05-15",
            "dateTimeGMT": "2025-05-15T06:30:00",
            "teams": [
            "United Arab Emirates Women",
            "Qatar Women"
            ],
            "teamInfo": [
            {
                "name": "Qatar Women",
                "shortname": "QAT-W",
                "img": "https://g.cricapi.com/iapi/1578-637914186206691459.png?w=48"
            },
            {
                "name": "United Arab Emirates Women",
                "shortname": "UAEW",
                "img": "https://g.cricapi.com/iapi/1136-637877081374906304.webp?w=48"
            }
            ],
            "series_id": "d98be13e-3b73-4858-99f3-b58c7131704b",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": true,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "b6436345-ccee-4b82-968c-21610175b26d",
            "name": "Nepal Women vs Bahrain Women, 14th Match",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "TBC, TBC",
            "date": "2025-05-15",
            "dateTimeGMT": "2025-05-15T02:30:00",
            "teams": [
            "Nepal Women",
            "Bahrain Women"
            ],
            "teamInfo": [
            {
                "name": "Bahrain Women",
                "shortname": "BAH-W",
                "img": "https://g.cricapi.com/iapi/1597-637926302418123133.webp?w=48"
            },
            {
                "name": "Nepal Women",
                "shortname": "NEPW",
                "img": "https://g.cricapi.com/iapi/54-637877084789981539.webp?w=48"
            }
            ],
            "series_id": "d98be13e-3b73-4858-99f3-b58c7131704b",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": true,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "d53abb76-308d-46b4-ac0f-ae62f6da7cbc",
            "name": "Thailand Women vs Bhutan Women, 13rd Match",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "TBC, TBC",
            "date": "2025-05-15",
            "dateTimeGMT": "2025-05-15T02:00:00",
            "teams": [
            "Bhutan Women",
            "Bhutan Women"
            ],
            "teamInfo": [
            {
                "name": "Bhutan Women",
                "shortname": "BHU-W",
                "img": "https://g.cricapi.com/iapi/1587-637928913171062293?w=48"
            }
            ],
            "series_id": "d98be13e-3b73-4858-99f3-b58c7131704b",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": false,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "51d49e5e-8774-4e9f-ae25-8e8633bbd0bc",
            "name": "United Arab Emirates Women vs Malaysia Women, 12th Match",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "TBC, TBC",
            "date": "2025-05-13",
            "dateTimeGMT": "2025-05-13T06:30:00",
            "teams": [
            "United Arab Emirates Women",
            "Malaysia Women"
            ],
            "teamInfo": [
            {
                "name": "Malaysia Women",
                "shortname": "ML-W",
                "img": "https://g.cricapi.com/iapi/1551-637926306213013515.webp?w=48"
            },
            {
                "name": "United Arab Emirates Women",
                "shortname": "UAEW",
                "img": "https://g.cricapi.com/iapi/1136-637877081374906304.webp?w=48"
            }
            ],
            "series_id": "d98be13e-3b73-4858-99f3-b58c7131704b",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": true,
            "matchStarted": false,
            "matchEnded": false
        },
        {
            "id": "a8c34ba8-05b9-4a8b-aa65-8f54e0a47500",
            "name": "Thailand Women vs Kuwait Women, 10th Match",
            "matchType": "t20",
            "status": "Match not started",
            "venue": "TBC, TBC",
            "date": "2025-05-13",
            "dateTimeGMT": "2025-05-13T02:30:00",
            "teams": [
            "Thailand Women",
            "Kuwait Women"
            ],
            "teamInfo": [
            {
                "name": "Kuwait Women",
                "shortname": "KU-W",
                "img": "https://g.cricapi.com/iapi/1588-637926303022728393.webp?w=48"
            },
            {
                "name": "Thailand Women",
                "shortname": "THW",
                "img": "https://g.cricapi.com/iapi/2351-637985730472466346.webp?w=48"
            }
            ],
            "series_id": "d98be13e-3b73-4858-99f3-b58c7131704b",
            "fantasyEnabled": false,
            "bbbEnabled": false,
            "hasSquad": true,
            "matchStarted": false,
            "matchEnded": false
        }
        ],
        "status": "success",
        "info": {
        "hitsToday": 1,
        "hitsUsed": 1,
        "hitsLimit": 100,
        "credits": 0,
        "server": 25,
        "offsetRows": 0,
        "totalRows": 10706,
        "queryTime": 156.0329,
        "s": 0,
        "cache": 0
        }
    }
    }
    ;
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
    
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
    
        // Get the ordinal suffix for the day
        const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
        };
    
        return `${day}${getOrdinal(day)} ${month} ${year}`;
    }
    export default function AddMatch() {
    const [matches] = useState<Match[]>(matchesData.data.data as unknown as Match[]);
    const { publicKey, sendTransaction } = useWallet();
    const [txStatus, setTxStatus] = useState<'pending' | 'success' | 'error' | null>(null);
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddToFeed = async (matchId: string) => {
        if (!publicKey) {
        setError('Please connect your wallet first');
        setTxStatus('error');
        setIsModalOpen(true);
        return;
        }

        try {
        setTxStatus('pending');
        setIsModalOpen(true);

          // Change to devnet endpoint
          const connection = new Connection('https://api.devnet.solana.com');
          const recipientAddress = new PublicKey('DTAZZC65t9zUCDYL7yXdAAMTZtSa1djmTTFQxnekmQGM');

        const transaction = new Transaction().add(
            SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientAddress,
            lamports: LAMPORTS_PER_SOL, // 1 SOL
            })
        );

        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature);

        setTxStatus('success');
        } catch (err) {
        console.error('Transaction failed:', err);
        setError(err instanceof Error ? err.message : 'Transaction failed');
        setTxStatus('error');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (txStatus === 'success' || txStatus === 'error') {
        setTxStatus(null);
        setError('');
        }
    };

    // Add this function to format the wallet address
    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <AnimatedBackground>
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
             <h1 className="text-2xl font-bold">Add Match to Feed</h1>
                <div className="flex items-center gap-2">
                {publicKey ? (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                   
                    </span>
                    <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
                </div>
                ) : (
                <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
                )}
            </div>
            </div>
            <div className="flex !z-50   justify-between items-center mb-4 ">
                <Link href="/admin" className='text-gray-500 cursor-pointer'>Home</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match:Match) => (
                <Card key={match.id} className="bg-white/10 backdrop-blur-lg">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{match.matchType.toUpperCase()}</span>
                    <span className="text-sm text-gray-400">{formatDate(match.date)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                    {match.teamInfo.map((team, index) => (
                        <div key={team.name} className="flex items-center">
                        <Image
                            src={team.img}
                            alt={team.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <span className="ml-2 text-sm">{team.shortname}</span>
                        </div>
                    ))}
                    </div>

                    <h3 className="font-semibold mb-2">{match.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{match.venue}</p>
                    <p className={`text-sm mb-4 ${match.status === "Match not started" ? "text-gray-400" : "text-green-500"}`}>{match.status}</p>

                    {match.score && (
                    <div className="mb-4">
                        {match.score.map((score, index) => (
                        <p key={index} className="text-sm">
                            {score.inning}: {score.r}/{score.w} ({score.o} ov)
                        </p>
                        ))}
                    </div>
                    )}
{ match.status !== "Match not started" ?
(<Button

    className="w-full bg-[#ffffff00] border-gray-400 border  text-gray-400 italic"
    >
Match has already concluded
    </Button>)
: 

                    <Button
                    onClick={() => handleAddToFeed(match.id)}
                    className="w-full bg-[#ffffff00] border-primary border  text-primary hover:text-white"
                    >
                    Add to Feed
                    </Button>
                    }
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
        
        <TransactionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          status={txStatus}
          error={error}
        />
        </AnimatedBackground>
    );
    }
