import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Dices, Shield, Anchor, Lightbulb, Sparkles } from 'lucide-react';

const TEAM_COLORS = {
  Athens: "#2F7FDB", Sparta: "#C23B22", Corinth: "#2E8B57",
  Thebes: "#8B5CF6", Argos: "#FF8C00"
};

const TEAM_SEA_COLORS = {
  Athens: "#87CEEB", Sparta: "#F08080", Corinth: "#90EE90",
  Thebes: "#C4B5FD", Argos: "#FFD39B"
};

const LAND_VP = 2;
const SEA_VP = 1;
const SCIENCE_PER_BUFF = 8;
const CULTURE_PER_BUFF = 10;

const CITYSTATE_BLURBS = {
  Athens: "Democracy/Philosophy: +1 Science & +1 Culture per roll",
  Sparta: "Military: Starts d6 Conquer (others d4), can reach d8",
  Corinth: "Naval: Starts with Sailing unlocked",
  Thebes: "Tactics: Reroll Conquer once, keep higher",
  Argos: "Culture: +2 Culture per Culture roll"
};

const DEFAULT_MAP = [
  ['L','L','L','L','L','L','L','L','L','L','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','L','L','W','W'],
  ['W','L','L','L','L','L','L','L','L','L','L','L','W','W','L','W','W','W','W','W','W','W','W','W','W','W','W','W','L','L','W'],
  ['W','W','L','L','L','L','L','L','L','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','L','L','L','L','L','L','L','L','L','W','L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','L','L','L','L','L','L','L','L','L','L','W','W','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','L','W'],
  ['W','L','W','W','L','L','L','L','L','L','L','L','L','L','W','W','L','L','L','W','W','W','W','W','W','W','W','W','W','W','L'],
  ['W','W','W','W','L','L','L','L','L','L','L','L','L','L','L','L','W','L','L','W','W','W','W','W','W','W','W','W','W','L','L'],
  ['L','L','W','W','W','W','W','W','W','W','W','W','L','L','L','T','L','L','W','L','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','L','W','W','W','L','L','L','L','L','L','L','W','L','L','L','L','L','W','W','L','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','L','L','L','L','L','L','L','L','L','C','W','W','W','A','W','W','W','W','L','W','W','W','W','W','W','W','W'],
  ['W','W','L','W','L','L','L','L','L','L','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','L','L','L','L','L','L','R','L','L','L','W','W','W','W','W','W','W','W','L','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','W','L','L','L','L','L','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','L','L','L','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','L','L','L','L','S','L','L','W','W','W','W','W','W','W','W','W','W','W','W','L','W','W','W','W','W'],
  ['W','W','W','W','W','W','L','L','W','W','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','W','L','W','W','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','W','W','W','W','L','W','W','L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L','L','L','L','L','L','L','L','W','L','L','L','W','W','W'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L','L','L','L','L','L','W','W','W']
];

const roll = (sides) => Math.floor(Math.random() * sides) + 1;

const App = () => {
  const [gameState, setGameState] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const canvasRef = useRef(null);

  if (!gameState) {
    return (
      <div>
        <TeamPicker onStart={(teams, settings) => {
          const newMap = DEFAULT_MAP.map((row, r) => 
            row.map((cell, c) => {
              const isLand = ['L','A','S','C','T','R'].includes(cell);
              let capital = null;
              if (cell === 'A') capital = 'Athens';
              if (cell === 'S') capital = 'Sparta';
              if (cell === 'C') capital = 'Corinth';
              if (cell === 'T') capital = 'Thebes';
              if (cell === 'R') capital = 'Argos';
              
              let owner = null;
              if (capital && teams.includes(capital)) owner = capital;
              
              return { col: c, row: r, isLand, capital, owner };
            })
          );

          const newPlayers = {};
          teams.forEach(t => {
            newPlayers[t] = {
              name: t, science: 0, culture: 0,
              conquerDie: t === 'Sparta' ? 6 : 4,
              canSail: t === 'Corinth',
              inRevolt: false, diplomacyImmunity: 0,
              scholarship: false, infrastructure: false, siegecraft: false,
              tourism: false, assimilation: false, goldenAge: false, goldenAgeGranted: 0,
              athensPassive: t === 'Athens', thebesReroll: t === 'Thebes', argosPlus2: t === 'Argos',
              sciTokens: 0, culTokens: 0, miscVP: 0,
              actions: {conquer: 0, expand: 0, sail: 0}
            };
          });

          setGameState({
            map: newMap, players: newPlayers, teams: teams,
            turnIdx: 0, globalTurn: 0, mode: 'Idle',
            status: 'Welcome! Roll dice to begin.',
            portCity: null, buffPicker: null,
            endCondition: settings.endCondition,
            targetRounds: settings.targetRounds,
            targetVP: settings.targetVP,
            gameEnded: false, winner: null
          });
        }} onShowRules={() => setShowRules(true)} />
        {showRules && <RulesPage onClose={() => setShowRules(false)} />}
      </div>
    );
  }

  return <GameBoard gameState={gameState} setGameState={setGameState} canvasRef={canvasRef} showRules={showRules} setShowRules={setShowRules} />;
};

const GameBoard = ({ gameState, setGameState, canvasRef, showRules, setShowRules }) => {
  useEffect(() => {
    drawCanvas();
    updatePortCity();
  }, [gameState]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState || gameState.map.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const R = 20;
    const dx = 1.5 * R;
    const dy = Math.sqrt(3) * R;
    
    canvas.width = gameState.map[0].length * dx + R + 40;
    canvas.height = gameState.map.length * dy + R + 40;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    gameState.map.forEach(row => {
      row.forEach(cell => {
        const cx = 20 + R + cell.col * dx;
        const cy = 20 + R + cell.row * dy + (cell.col % 2 === 1 ? dy/2 : 0);
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = Math.PI/3 * i;
          const x = cx + R * Math.cos(a);
          const y = cy + R * Math.sin(a);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        
        ctx.fillStyle = cell.owner 
          ? (cell.isLand ? TEAM_COLORS[cell.owner] : TEAM_SEA_COLORS[cell.owner])
          : (cell.isLand ? '#F9F6EE' : '#D7EEF7');
        ctx.fill();
        ctx.strokeStyle = '#9AA6B2';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        if (cell.capital && gameState.teams.includes(cell.capital)) {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(cx, cy, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = TEAM_COLORS[cell.capital];
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', cx, cy);
        }
      });
    });
  };

  const updatePortCity = () => {
    const counts = {};
    gameState.teams.forEach(t => {
      counts[t] = gameState.map.flat().filter(c => c.owner === t && !c.isLand).length;
    });
    const maxSea = Math.max(...Object.values(counts));
    const leaders = Object.keys(counts).filter(t => counts[t] === maxSea);
    const newPort = maxSea >= 6 && leaders.length === 1 ? leaders[0] : null;
    if (newPort !== gameState.portCity) {
      setGameState(prev => ({...prev, portCity: newPort}));
    }
  };

  const currentPlayer = gameState.teams[gameState.turnIdx % gameState.teams.length];
  const p = gameState.players[currentPlayer];
  const roundsCompleted = Math.floor(gameState.globalTurn / Math.max(1, gameState.teams.length));

  const countHexes = (team, isLand) => gameState.map.flat().filter(c => c.owner === team && c.isLand === isLand).length;
  
  const totalVP = (team) => {
    const pl = gameState.players[team];
    const land = countHexes(team, true) * LAND_VP;
    const sea = countHexes(team, false) * SEA_VP;
    const sci = pl.science / 2;
    const cul = pl.culture / 4;
    const port = gameState.portCity === team ? 10 : 0;
    return land + sea + sci + cul + pl.miscVP + port;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Struggle of the Poleis</h1>
          <button onClick={() => setShowRules(true)} className="bg-gray-600 text-white px-4 py-2 rounded font-semibold hover:bg-gray-700">
            Rules
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <div className="overflow-auto max-h-[700px] border rounded">
              <canvas ref={canvasRef} className="cursor-pointer" />
            </div>
          </div>
          
          <div className="space-y-4">
            <PlayerPanel 
              gameState={gameState} 
              setGameState={setGameState} 
              currentPlayer={currentPlayer}
              p={p}
              roundsCompleted={roundsCompleted}
            />
            
            <Scoreboard 
              gameState={gameState}
              currentPlayer={currentPlayer}
              countHexes={countHexes}
              totalVP={totalVP}
            />
          </div>
        </div>
      </div>
      
      {gameState.buffPicker && (
        <BuffPicker 
          team={gameState.buffPicker.team}
          type={gameState.buffPicker.type}
          player={gameState.players[gameState.buffPicker.team]}
          onApply={(choice) => {
            setGameState(prev => {
              const {team, type} = prev.buffPicker;
              const p = prev.players[team];
              const newP = {...p};
              
              if (type === 'science') {
                newP.sciTokens--;
                if (choice === 'sail') newP.canSail = true;
                if (choice === 'military') newP.conquerDie = newP.conquerDie === 4 ? 6 : 8;
                if (choice === 'scholar') newP.scholarship = true;
                if (choice === 'infra') newP.infrastructure = true;
                if (choice === 'siege') newP.siegecraft = true;
              } else {
                newP.culTokens--;
                if (choice === 'diplo') newP.diplomacyImmunity += 3;
                if (choice === 'golden') newP.goldenAge = true;
                if (choice === 'tourism') newP.tourism = true;
                if (choice === 'assim') newP.assimilation = true;
              }
              
              const newPlayers = {...prev.players, [team]: newP};
              const newState = {...prev, players: newPlayers, buffPicker: null};
              
              if ((type === 'science' && newP.sciTokens > 0) || (type === 'culture' && newP.culTokens > 0)) {
                setTimeout(() => setGameState(s => ({...s, buffPicker: {team, type}})), 100);
              }
              
              return newState;
            });
          }}
          onDefer={() => setGameState(prev => ({...prev, buffPicker: null}))}
        />
      )}
      
      {gameState.gameEnded && gameState.winner && (
        <GameOverModal
          winner={gameState.winner}
          teams={gameState.teams}
          players={gameState.players}
          totalVP={totalVP}
          onClose={() => setGameState(prev => ({...prev, gameEnded: false}))}
        />
      )}
      
      {showRules && <RulesPage onClose={() => setShowRules(false)} />}
    </div>
  );
};

const PlayerPanel = ({ gameState, setGameState, currentPlayer, p, roundsCompleted }) => {
  const countHexes = (team, isLand) => gameState.map.flat().filter(c => c.owner === team && c.isLand === isLand).length;
  
  const totalVP = (team) => {
    const pl = gameState.players[team];
    const land = countHexes(team, true) * LAND_VP;
    const sea = countHexes(team, false) * SEA_VP;
    const sci = pl.science / 2;
    const cul = pl.culture / 4;
    const port = gameState.portCity === team ? 10 : 0;
    return land + sea + sci + cul + pl.miscVP + port;
  };

  const addScience = (team, amount) => {
    setGameState(prev => {
      const p = prev.players[team];
      const before = Math.floor(p.science / SCIENCE_PER_BUFF);
      const newScience = p.science + amount;
      const after = Math.floor(newScience / SCIENCE_PER_BUFF);
      const newTokens = p.sciTokens + Math.max(0, after - before);
      
      const newPlayers = {...prev.players, [team]: {...p, science: newScience, sciTokens: newTokens}};
      const newState = {...prev, players: newPlayers};
      
      if (newTokens > 0 && !prev.buffPicker) {
        newState.buffPicker = {team, type: 'science'};
      }
      
      return newState;
    });
  };

  const addCulture = (team, amount) => {
    setGameState(prev => {
      const p = prev.players[team];
      const before = Math.floor(p.culture / CULTURE_PER_BUFF);
      const newCulture = p.culture + amount;
      const after = Math.floor(newCulture / CULTURE_PER_BUFF);
      const newTokens = p.culTokens + Math.max(0, after - before);
      
      const newPlayers = {...prev.players, [team]: {...p, culture: newCulture, culTokens: newTokens}};
      const newState = {...prev, players: newPlayers};
      
      if (newTokens > 0 && !prev.buffPicker) {
        newState.buffPicker = {team, type: 'culture'};
      }
      
      return newState;
    });
  };

  const rollConquer = () => {
    if (p.diplomacyImmunity > 0) {
      setGameState(prev => ({...prev, status: `${currentPlayer} has immunity and cannot attack`}));
      return;
    }

    if (p.inRevolt) {
      const r = roll(4);
      if (r <= 2) {
        setGameState(prev => ({...prev, status: `Revolt failed (${r}/4)`, mode: 'Idle'}));
      } else {
        const capital = gameState.map.flat().find(c => c.capital === currentPlayer);
        if (capital) {
          setGameState(prev => ({
            ...prev,
            map: prev.map.map(rowArr => rowArr.map(cell => 
              cell.col === capital.col && cell.row === capital.row ? {...cell, owner: currentPlayer} : cell
            )),
            players: {
              ...prev.players,
              [currentPlayer]: {
                ...prev.players[currentPlayer],
                inRevolt: false, diplomacyImmunity: 0,
                miscVP: prev.players[currentPlayer].miscVP + 10
              }
            },
            status: `${currentPlayer} revolt succeeds! (${r}/4) +10 VP. Immunity starts next turn.`
          }));
        }
      }
      return;
    }

    let r = roll(p.conquerDie);
    let msg = `rolled ${r}`;
    
    if (p.thebesReroll) {
      const r2 = roll(p.conquerDie);
      r = Math.max(r, r2);
      msg = `rolled ${r} (Thebes reroll)`;
    }

    const total = r + (p.siegecraft ? 1 : 0);
    
    setGameState(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [currentPlayer]: {
          ...prev.players[currentPlayer],
          actions: {...prev.players[currentPlayer].actions, conquer: total}
        }
      },
      mode: 'conquer',
      status: `Conquer: ${total} actions (${msg}${p.siegecraft ? ' +1' : ''})`
    }));
  };

  const rollExpand = () => {
    if (p.inRevolt) return;
    const r = roll(6);
    setGameState(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [currentPlayer]: {
          ...prev.players[currentPlayer],
          actions: {...prev.players[currentPlayer].actions, expand: r}
        }
      },
      mode: 'expand',
      status: `Expand: ${r} actions (rolled ${r})`
    }));
  };

  const rollSail = () => {
    if (p.inRevolt || !p.canSail) return;
    const r = roll(8);
    setGameState(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [currentPlayer]: {
          ...prev.players[currentPlayer],
          actions: {...prev.players[currentPlayer].actions, sail: r}
        }
      },
      mode: 'sail',
      status: `Sail: ${r} actions (rolled ${r})`
    }));
  };

  const rollScience = () => {
    if (p.inRevolt) return;
    let r = roll(12);
    let msg = `rolled ${r}`;
    
    if (p.scholarship) {
      const r2 = roll(12);
      r = Math.max(r, r2);
      msg = `rolled ${r} (Scholarship reroll)`;
    }
    
    const bonus = p.athensPassive ? 1 : 0;
    const total = r + bonus;
    addScience(currentPlayer, total);
    setGameState(prev => ({...prev, status: `Science: +${total} (${msg}${bonus ? ' +1' : ''})`}));
  };

  const rollCulture = () => {
    if (p.inRevolt) return;
    const r = roll(20);
    const bonus = (p.athensPassive ? 1 : 0) + (p.argosPlus2 ? 2 : 0);
    const total = r + bonus;
    addCulture(currentPlayer, total);
    setGameState(prev => ({...prev, status: `Culture: +${total} (rolled ${r}${bonus ? ` +${bonus}` : ''})`}));
  };

  const endTurn = () => {
    let newMiscVP = p.miscVP;
    if (p.infrastructure) newMiscVP += countHexes(currentPlayer, true) * 0.25;
    if (p.tourism) newMiscVP += countHexes(currentPlayer, false) * 0.5;
    if (p.goldenAge) {
      const levels = Math.floor(p.culture / 20);
      if (levels > p.goldenAgeGranted) newMiscVP += (levels - p.goldenAgeGranted);
    }
    
    setGameState(prev => {
      const prevP = prev.players[currentPlayer];
      const justExitedRevolt = !prevP.inRevolt && prevP.diplomacyImmunity === 0;
      
      const newState = {
        ...prev,
        players: {
          ...prev.players,
          [currentPlayer]: {
            ...prev.players[currentPlayer],
            miscVP: newMiscVP,
            diplomacyImmunity: justExitedRevolt ? 2 : Math.max(0, p.diplomacyImmunity - 1),
            actions: {conquer: 0, expand: 0, sail: 0},
            goldenAgeGranted: p.goldenAge ? Math.floor(p.culture / 20) : p.goldenAgeGranted
          }
        },
        mode: 'Idle',
        turnIdx: prev.turnIdx + 1,
        globalTurn: prev.globalTurn + 1,
        status: 'Turn ended'
      };
      
      const newRoundsCompleted = Math.floor(newState.globalTurn / Math.max(1, newState.teams.length));
      
      if (prev.endCondition === 'rounds' && newRoundsCompleted >= prev.targetRounds) {
        const scores = prev.teams.map(t => ({ team: t, vp: totalVP(t) })).sort((a, b) => b.vp - a.vp);
        newState.gameEnded = true;
        newState.winner = scores[0].team;
        newState.status = `Game Over! ${scores[0].team} wins with ${scores[0].vp.toFixed(1)} VP!`;
      }
      
      if (prev.endCondition === 'vp') {
        const scores = prev.teams.map(t => ({ team: t, vp: totalVP(t) }));
        const highestVP = Math.max(...scores.map(s => s.vp));
        if (highestVP >= prev.targetVP) {
          const winner = scores.find(s => s.vp === highestVP);
          newState.gameEnded = true;
          newState.winner = winner.team;
          newState.status = `Game Over! ${winner.team} wins with ${winner.vp.toFixed(1)} VP!`;
        }
      }
      
      return newState;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold" style={{color: TEAM_COLORS[currentPlayer]}}>{currentPlayer}</h2>
        <span className="text-sm text-gray-600">Round {roundsCompleted + 1}</span>
      </div>
      
      {p.inRevolt && (
        <div className="bg-red-100 border border-red-300 rounded p-2 mb-2 text-sm">
          <AlertCircle className="inline w-4 h-4 mr-1"/> Revolt Mode
        </div>
      )}
      
      {p.diplomacyImmunity > 0 && (
        <div className="bg-green-100 border border-green-300 rounded p-2 mb-2 text-sm">
          <Shield className="inline w-4 h-4 mr-1"/> Immune ({p.diplomacyImmunity} turns)
        </div>
      )}
      
      <div className="text-sm text-gray-700 mb-3">{gameState.status}</div>
      
      <div className="space-y-2">
        <button onClick={rollConquer} className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 flex items-center justify-center gap-2">
          <Dices className="w-4 h-4"/> Conquer (d{p.conquerDie})
        </button>
        <button onClick={rollExpand} disabled={p.inRevolt} className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400">
          Expand (d6)
        </button>
        <button onClick={rollSail} disabled={p.inRevolt || !p.canSail} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
          <Anchor className="w-4 h-4"/> Sail (d8)
        </button>
        <button onClick={rollScience} disabled={p.inRevolt} className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
          <Lightbulb className="w-4 h-4"/> Science (d12)
        </button>
        <button onClick={rollCulture} disabled={p.inRevolt} className="w-full bg-yellow-600 text-white py-2 rounded font-semibold hover:bg-yellow-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4"/> Culture (d20)
        </button>
      </div>
      
      <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
        <div className="font-semibold mb-1">Actions Available:</div>
        <div>Conquer: {p.actions.conquer}</div>
        <div>Expand: {p.actions.expand}</div>
        <div>Sail: {p.actions.sail}</div>
      </div>
      
      <div className="flex gap-2 mt-3">
        <button onClick={() => setGameState(prev => ({...prev, mode: 'Idle'}))} className="flex-1 bg-gray-500 text-white py-2 rounded font-semibold hover:bg-gray-600">
          Cancel
        </button>
        <button onClick={endTurn} className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
          End Turn →
        </button>
      </div>
    </div>
  );
};

const Scoreboard = ({ gameState, currentPlayer, countHexes, totalVP }) => (
  <div className="bg-white rounded-lg shadow p-4 max-h-96 overflow-y-auto">
    <h3 className="font-bold mb-3">Scoreboard</h3>
    <div className="space-y-2">
      {gameState.teams.map(t => {
        const tp = gameState.players[t];
        const vp = totalVP(t);
        const landCt = countHexes(t, true);
        const seaCt = countHexes(t, false);
        const isCurrentPlayer = t === currentPlayer;
        
        return (
          <div key={t} className={`border-2 rounded p-2 ${isCurrentPlayer ? 'ring-2 ring-blue-400' : ''}`} style={{borderColor: TEAM_COLORS[t]}}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{color: TEAM_COLORS[t]}}>{t}</span>
                {tp.diplomacyImmunity > 0 && (
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                    🛡️ {tp.diplomacyImmunity}
                  </span>
                )}
                {tp.inRevolt && (
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">
                    ⚠️ Revolt
                  </span>
                )}
              </div>
              <span className="text-2xl font-bold">{vp.toFixed(1)}</span>
            </div>
            <div className="text-xs text-gray-600">
              <div>Land: {landCt} ({landCt * LAND_VP} VP) | Sea: {seaCt} ({seaCt * SEA_VP} VP)</div>
              <div>Science: {tp.science.toFixed(1)} | Culture: {tp.culture}</div>
              <div>Misc VP: {tp.miscVP.toFixed(1)}</div>
              {gameState.portCity === t && <div className="text-green-600 font-semibold">⚓ Port City +10</div>}
            </div>
          </div>
        );
      })}
    </div>
    
    {gameState.endCondition === 'rounds' && (
      <div className="mt-4 text-sm text-gray-600 text-center">
        Game ends after Round {gameState.targetRounds}
      </div>
    )}
    {gameState.endCondition === 'vp' && (
      <div className="mt-4 text-sm text-gray-600 text-center">
        First to {gameState.targetVP} VP wins
      </div>
    )}
  </div>
);

const GameOverModal = ({ winner, teams, players, totalVP, onClose }) => {
  const scores = teams.map(t => ({ team: t, vp: totalVP(t) })).sort((a, b) => b.vp - a.vp);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6" style={{color: TEAM_COLORS[winner]}}>
          {winner} Wins!
        </h2>
        
        <div className="space-y-3 mb-6">
          {scores.map((s, idx) => (
            <div key={s.team} className="flex justify-between items-center p-3 border-2 rounded" style={{borderColor: TEAM_COLORS[s.team]}}>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{idx + 1}.</span>
                <span className="font-bold text-lg" style={{color: TEAM_COLORS[s.team]}}>{s.team}</span>
              </div>
              <span className="text-2xl font-bold">{s.vp.toFixed(1)}</span>
            </div>
          ))}
        </div>
        
        <button onClick={onClose} className="w-full bg-blue-600 text-white py-3 rounded font-semibold text-lg hover:bg-blue-700">
          Continue Playing
        </button>
      </div>
    </div>
  );
};

const TeamPicker = ({ onStart, onShowRules }) => {
  const [selected, setSelected] = useState(['Athens', 'Sparta', 'Corinth']);
  const [turnOrder, setTurnOrder] = useState(['Athens', 'Sparta', 'Corinth', 'Thebes', 'Argos']);
  const [endCondition, setEndCondition] = useState('rounds');
  const [targetRounds, setTargetRounds] = useState(15);
  const [targetVP, setTargetVP] = useState(100);
  
  const moveUp = (team) => {
    const idx = turnOrder.indexOf(team);
    if (idx > 0) {
      const newOrder = [...turnOrder];
      [newOrder[idx], newOrder[idx-1]] = [newOrder[idx-1], newOrder[idx]];
      setTurnOrder(newOrder);
    }
  };
  
  const moveDown = (team) => {
    const idx = turnOrder.indexOf(team);
    if (idx < turnOrder.length - 1) {
      const newOrder = [...turnOrder];
      [newOrder[idx], newOrder[idx+1]] = [newOrder[idx+1], newOrder[idx]];
      setTurnOrder(newOrder);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Select City-States</h2>
          <button onClick={onShowRules} className="bg-gray-600 text-white px-4 py-2 rounded font-semibold hover:bg-gray-700">
            Rules
          </button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <h3 className="font-semibold mb-2">City-State Traits:</h3>
          {Object.entries(CITYSTATE_BLURBS).map(([name, desc]) => (
            <div key={name} className="text-sm mb-1">
              <span className="font-medium">{name}:</span> {desc}
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Select Participants:</h3>
          <div className="space-y-2">
            {['Athens', 'Sparta', 'Corinth', 'Thebes', 'Argos'].map(t => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selected.includes(t)} onChange={() => {
                  setSelected(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
                }} className="w-4 h-4" />
                <span className="font-medium">{t}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Turn Order:</h3>
          <div className="space-y-2">
            {turnOrder.filter(t => selected.includes(t)).map((team, idx, arr) => (
              <div key={team} className="flex items-center gap-2">
                <span className="w-8 text-center font-semibold">{idx + 1}.</span>
                <span className="flex-1">{team}</span>
                <button onClick={() => moveUp(team)} disabled={idx === 0} className="px-2 py-1 bg-gray-300 rounded disabled:opacity-30">↑</button>
                <button onClick={() => moveDown(team)} disabled={idx === arr.length - 1} className="px-2 py-1 bg-gray-300 rounded disabled:opacity-30">↓</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Game End Condition:</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" checked={endCondition === 'rounds'} onChange={() => setEndCondition('rounds')} className="w-4 h-4" />
              <span>After</span>
              <input type="number" value={targetRounds} onChange={(e) => setTargetRounds(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 px-2 py-1 border rounded" min="1" />
              <span>rounds</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input type="radio" checked={endCondition === 'vp'} onChange={() => setEndCondition('vp')} className="w-4 h-4" />
              <span>First to</span>
              <input type="number" value={targetVP} onChange={(e) => setTargetVP(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 px-2 py-1 border rounded" min="1" />
              <span>VP</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input type="radio" checked={endCondition === 'none'} onChange={() => setEndCondition('none')} className="w-4 h-4" />
              <span>Manual (no automatic end)</span>
            </label>
          </div>
        </div>
        
        <button onClick={() => {
          if (selected.length > 0) {
            const orderedTeams = turnOrder.filter(t => selected.includes(t));
            onStart(orderedTeams, { endCondition, targetRounds, targetVP });
          }
        }} disabled={selected.length === 0} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400">
          Start Game
        </button>
      </div>
    </div>
  );
};

const BuffPicker = ({ team, type, player, onApply, onDefer }) => {
  const scienceOpts = [];
  if (!player.canSail) scienceOpts.push({id: 'sail', label: 'Sailing', desc: 'Claim & conquer sea hexes'});
  if (player.conquerDie === 4 || (team === 'Sparta' && player.conquerDie === 6)) 
    scienceOpts.push({id: 'military', label: 'Stronger Military', desc: 'Upgrade conquer die'});
  if (!player.scholarship) scienceOpts.push({id: 'scholar', label: 'Scholarship', desc: 'Reroll Science once'});
  if (!player.infrastructure) scienceOpts.push({id: 'infra', label: 'Infrastructure', desc: '+0.25 VP per land/turn'});
  if (!player.siegecraft) scienceOpts.push({id: 'siege', label: 'Siegecraft', desc: '+1 to conquer rolls'});
  
  const cultureOpts = [{id: 'diplo', label: 'Diplomacy', desc: '+3 turns immunity (stackable)'}];
  if (!player.goldenAge) cultureOpts.push({id: 'golden', label: 'Golden Age', desc: '+1 VP per 20 culture'});
  if (!player.tourism) cultureOpts.push({id: 'tourism', label: 'Tourism & Trade', desc: '+0.5 VP per sea/turn'});
  if (!player.assimilation) cultureOpts.push({id: 'assim', label: 'Assimilation', desc: '+1 culture per conquest'});
  
  const opts = type === 'science' ? scienceOpts : cultureOpts;
  const [choice, setChoice] = useState(opts[0]?.id);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">{team}: Choose {type} Buff</h3>
        
        <div className="space-y-2 mb-4">
          {opts.map(opt => (
            <label key={opt.id} className="flex items-start gap-2 cursor-pointer">
              <input type="radio" value={opt.id} checked={choice === opt.id} onChange={() => setChoice(opt.id)} className="mt-1" />
              <div>
                <div className="font-medium">{opt.label}</div>
                <div className="text-sm text-gray-600">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => onApply(choice)} className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold">Apply</button>
          <button onClick={onDefer} className="px-4 bg-gray-300 rounded">Later</button>
        </div>
      </div>
    </div>
  );
};

const RulesPage = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Game Rules</h2>
        <button onClick={onClose} className="text-2xl font-bold text-gray-500 hover:text-gray-700">&times;</button>
      </div>
      <div className="text-sm space-y-3">
        <p><strong>Struggle of the Poleis</strong> is a competitive territory-control game. Roll dice, claim hexes, unlock buffs, and accumulate Victory Points (VP) to win.</p>
        <p><strong>City-States:</strong> Athens (+1 Sci/Cul per roll), Sparta (d6 Conquer), Corinth (Sailing), Thebes (Conquer reroll), Argos (+2 Cul per roll)</p>
        <p><strong>Actions:</strong> Conquer (attack enemies), Expand (claim land), Sail (claim sea), Science (unlock buffs), Culture (unlock buffs)</p>
        <p><strong>VP Sources:</strong> Land (2 VP), Sea (1 VP), Science (½ VP per point), Culture (¼ VP per point), Port City (+10 for 6+ sea hexes)</p>
        <p><strong>Revolt:</strong> Lose all land → enter Revolt. Roll d4: 3-4 to restore capital (+10 VP, immunity next turn)</p>
        <p><strong>Capitals:</strong> Protected first 4 rounds. Capturing any capital = +10 VP</p>
      </div>
      <button onClick={onClose} className="mt-6 w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Close Rules</button>
    </div>
  </div>
);

export default App;