import { assert } from 'chai';
import { Teams } from '../Player.js';
import { MpSettingsParser, MpSettingsResult } from '../parsers/MpSettingsParser.js';
import { MpSettingsCases } from './cases/MpSettingsCases.js';

import log4js from 'log4js';

describe("MpSettingsParserTest", function () {
  before(function () {
    log4js.configure("config/log_mocha_silent.json");
  });
  it("mp settings parse test", () => {
    const p = new MpSettingsParser();
    let b: boolean = false;

    assert.isFalse(p.isParsing);
    assert.isFalse(p.isParsed);
    assert.isTrue(p.feedLine("Room name: 5* (´・ω・`) host rotate, History: https://osu.ppy.sh/mp/53084403"));
    assert.isTrue(p.isParsing);
    assert.isFalse(p.isParsed);
    assert.isTrue(p.feedLine("Beatmap: https://osu.ppy.sh/b/853167 Silent Siren - Hachigatsu no Yoru [August]"));
    assert.isTrue(p.feedLine("Team mode: HeadToHead, Win condition: Score"));
    assert.isTrue(p.feedLine("Active mods: Freemod"));
    assert.isTrue(p.feedLine("Players: 5"));
    assert.isTrue(p.isParsing);
    assert.isFalse(p.isParsed);
    assert.isFalse(p.feedLine("hello!"));
    assert.isTrue(p.isParsing);
    assert.isFalse(p.isParsed);
    assert.isTrue(p.feedLine("Slot 1  Not Ready https://osu.ppy.sh/u/8286882 gnsksz          [Host]"));
    assert.isTrue(p.feedLine("Slot 2  Not Ready https://osu.ppy.sh/u/10351992 Discuzz         [Hidden, DoubleTime]"));
    assert.isTrue(p.feedLine("Slot 3  Not Ready https://osu.ppy.sh/u/13745792 Seidosam        "));
    assert.isTrue(p.feedLine("Slot 4  Not Ready https://osu.ppy.sh/u/7354213 Suitaksas       "));
    assert.isTrue(p.isParsing);
    assert.isTrue(p.feedLine("Slot 5  Not Ready https://osu.ppy.sh/u/13585495 -Kasell         "));
    assert.isFalse(p.isParsing);
    assert.isTrue(p.isParsed);
    assert.isNotNull(p.result);

    const r = p.result as MpSettingsResult;
    assert.equal(r.name, "5* (´・ω・`) host rotate");
    assert.equal(r.history, "https://osu.ppy.sh/mp/53084403");
    assert.equal(r.beatmapUrl, "https://osu.ppy.sh/b/853167");
    assert.equal(r.beatmapTitle, "Silent Siren - Hachigatsu no Yoru [August]");
    assert.equal(r.teamMode, "HeadToHead");
    assert.equal(r.winCondition, "Score");
    assert.equal(r.activeMods, "Freemod");
    assert.equal(r.players.length, 5);
    assert.equal(r.players[0].name, "gnsksz");
    assert.equal(r.players[1].name, "Discuzz");
    assert.equal(r.players[2].name, "Seidosam");
    assert.equal(r.players[3].name, "Suitaksas");
    assert.equal(r.players[4].name, "-Kasell");
    assert.equal(r.players[0].id, 8286882);
    assert.equal(r.players[1].id, 10351992);
    assert.equal(r.players[2].id, 13745792);
    assert.equal(r.players[3].id, 7354213);
    assert.equal(r.players[4].id, 13585495);
    assert.equal(r.players[0].isHost, true);
    assert.equal(r.players[1].isHost, false);
    assert.equal(r.players[2].isHost, false);
    assert.equal(r.players[3].isHost, false);
    assert.equal(r.players[4].isHost, false);
    assert.equal(r.players[0].team, Teams.None);
    assert.equal(r.players[1].team, Teams.None);
    assert.equal(r.players[2].team, Teams.None);
    assert.equal(r.players[3].team, Teams.None);
    assert.equal(r.players[4].team, Teams.None);
    assert.equal(r.players[0].options, "Host");
    assert.equal(r.players[1].options, "Hidden, DoubleTime");
    assert.equal(r.players[2].options, "");
    assert.equal(r.players[3].options, "");
    assert.equal(r.players[4].options, "");
  });

  it("mp settings parse with space test", () => {
    const p = new MpSettingsParser();
    assert.isTrue(p.feedLine("Room name: 5* (´・ω・`) host rotate, History: https://osu.ppy.sh/mp/53084403"));
    assert.isTrue(p.feedLine("Beatmap: https://osu.ppy.sh/b/853167 Silent Siren - Hachigatsu no Yoru [August]"));
    assert.isTrue(p.feedLine("Team mode: HeadToHead, Win condition: Score"));
    assert.isTrue(p.feedLine("Active mods: Freemod"));
    assert.isTrue(p.feedLine("Players: 5"));
    assert.isTrue(p.feedLine("Slot 1  Not Ready https://osu.ppy.sh/u/8286882 gns ksz         [Host]"));
    assert.isTrue(p.feedLine("Slot 2  Not Ready https://osu.ppy.sh/u/10351992 Discuzz         [Hidden, DoubleTime]"));
    assert.isTrue(p.feedLine("Slot 3  Not Ready https://osu.ppy.sh/u/13745792 Seido sam       "));
    assert.isTrue(p.feedLine("Slot 4  Not Ready https://osu.ppy.sh/u/7354213 Suitaksas       "));
    assert.isTrue(p.feedLine("Slot 5  Not Ready https://osu.ppy.sh/u/13585495 -Kasell         "));
    assert.isFalse(p.isParsing);
    assert.isNotNull(p.result);
    const r = p.result as MpSettingsResult;
    assert.equal(r.name, "5* (´・ω・`) host rotate");
    assert.equal(r.history, "https://osu.ppy.sh/mp/53084403");
    assert.equal(r.beatmapUrl, "https://osu.ppy.sh/b/853167");
    assert.equal(r.beatmapTitle, "Silent Siren - Hachigatsu no Yoru [August]");
    assert.equal(r.teamMode, "HeadToHead");
    assert.equal(r.winCondition, "Score");
    assert.equal(r.activeMods, "Freemod");
    assert.equal(r.players.length, 5);
    assert.equal(r.players[0].name, "gns ksz");
    assert.equal(r.players[1].name, "Discuzz");
    assert.equal(r.players[2].name, "Seido sam");
    assert.equal(r.players[3].name, "Suitaksas");
    assert.equal(r.players[4].name, "-Kasell");
    assert.equal(r.players[0].id, 8286882);
    assert.equal(r.players[1].id, 10351992);
    assert.equal(r.players[2].id, 13745792);
    assert.equal(r.players[3].id, 7354213);
    assert.equal(r.players[4].id, 13585495);
    assert.equal(r.players[0].isHost, true);
    assert.equal(r.players[1].isHost, false);
    assert.equal(r.players[2].isHost, false);
    assert.equal(r.players[3].isHost, false);
    assert.equal(r.players[4].isHost, false);
    assert.equal(r.players[0].options, "Host");
    assert.equal(r.players[0].team, Teams.None);
    assert.equal(r.players[1].options, "Hidden, DoubleTime");
  });

  it("mp settings parse with blackets test", () => {
    const p = new MpSettingsParser();
    assert.isTrue(p.feedLine("Room name: 5* (´・ω・`) host rotate, History: https://osu.ppy.sh/mp/53084403"));
    assert.isTrue(p.feedLine("Beatmap: https://osu.ppy.sh/b/853167 Silent Siren - Hachigatsu no Yoru [August]"));
    assert.isTrue(p.feedLine("Team mode: HeadToHead, Win condition: Score"));
    assert.isTrue(p.feedLine("Active mods: Freemod"));
    assert.isTrue(p.feedLine("Players: 5"));
    assert.isTrue(p.feedLine("Slot 1  Not Ready https://osu.ppy.sh/u/8286882 gnsksz[aueie]   [Host]"));
    assert.isTrue(p.feedLine("Slot 2  Not Ready https://osu.ppy.sh/u/10351992 Discuzz [as]v   [Hidden, DoubleTime]"));
    assert.isTrue(p.feedLine("Slot 3  Not Ready https://osu.ppy.sh/u/13745792 Sedo sam [quit] "));
    assert.isTrue(p.feedLine("Slot 4  Not Ready https://osu.ppy.sh/u/7354213 Suit[__]aksas   "));
    assert.isTrue(p.feedLine("Slot 5  Not Ready https://osu.ppy.sh/u/13585495 -K][][a sell    "));
    assert.isFalse(p.isParsing);
    assert.isNotNull(p.result);

    const r = p.result as MpSettingsResult;
    assert.equal(r.name, "5* (´・ω・`) host rotate");
    assert.equal(r.history, "https://osu.ppy.sh/mp/53084403");
    assert.equal(r.beatmapUrl, "https://osu.ppy.sh/b/853167");
    assert.equal(r.beatmapTitle, "Silent Siren - Hachigatsu no Yoru [August]");
    assert.equal(r.teamMode, "HeadToHead");
    assert.equal(r.winCondition, "Score");
    assert.equal(r.activeMods, "Freemod");
    assert.equal(r.players.length, 5);
    assert.equal(r.players[0].name, "gnsksz[aueie]");
    assert.equal(r.players[1].name, "Discuzz [as]v");
    assert.equal(r.players[2].name, "Sedo sam [quit]");
    assert.equal(r.players[3].name, "Suit[__]aksas");
    assert.equal(r.players[4].name, "-K][][a sell");
    assert.equal(r.players[0].id, 8286882);
    assert.equal(r.players[1].id, 10351992);
    assert.equal(r.players[2].id, 13745792);
    assert.equal(r.players[3].id, 7354213);
    assert.equal(r.players[4].id, 13585495);
    assert.equal(r.players[0].isHost, true);
    assert.equal(r.players[1].isHost, false);
    assert.equal(r.players[2].isHost, false);
    assert.equal(r.players[3].isHost, false);
    assert.equal(r.players[4].isHost, false);
    assert.equal(r.players[0].options, "Host");
    assert.equal(r.players[1].options, "Hidden, DoubleTime");
  });


  it("mp settings none orderd slot test", () => {
    const p = new MpSettingsParser();
    assert.isTrue(p.feedLine("Room name: 5* (´・ω・`) host rotate, History: https://osu.ppy.sh/mp/53084403"));
    assert.isTrue(p.feedLine("Beatmap: https://osu.ppy.sh/b/853167 Silent Siren - Hachigatsu no Yoru [August]"));
    assert.isTrue(p.feedLine("Team mode: HeadToHead, Win condition: Score"));
    assert.isTrue(p.feedLine("Active mods: Freemod"));
    assert.isTrue(p.feedLine("Players: 5"));
    assert.isTrue(p.feedLine("Slot 1  Not Ready https://osu.ppy.sh/u/8286882 gnsksz          [Host]"));
    assert.isTrue(p.feedLine("Slot 2  Not Ready https://osu.ppy.sh/u/10351992 Discuzz         [Hidden, DoubleTime]"));
    assert.isTrue(p.feedLine("Slot 6  Not Ready https://osu.ppy.sh/u/13745792 Seidosam        "));
    assert.isTrue(p.feedLine("Slot 9  Not Ready https://osu.ppy.sh/u/7354213 Suitaksas       "));
    assert.isTrue(p.feedLine("Slot 12  Not Ready https://osu.ppy.sh/u/13585495 -Kasell         "));
    assert.isFalse(p.isParsing);
    assert.isNotNull(p.result);

    const r = p.result as MpSettingsResult;
    assert.equal(r.name, "5* (´・ω・`) host rotate");
    assert.equal(r.history, "https://osu.ppy.sh/mp/53084403");
    assert.equal(r.beatmapUrl, "https://osu.ppy.sh/b/853167");
    assert.equal(r.beatmapTitle, "Silent Siren - Hachigatsu no Yoru [August]");
    assert.equal(r.teamMode, "HeadToHead");
    assert.equal(r.winCondition, "Score");
    assert.equal(r.activeMods, "Freemod");
    assert.equal(r.players.length, 5);
    assert.equal(r.players[0].name, "gnsksz");
    assert.equal(r.players[1].name, "Discuzz");
    assert.equal(r.players[2].name, "Seidosam");
    assert.equal(r.players[3].name, "Suitaksas");
    assert.equal(r.players[4].name, "-Kasell");
    assert.equal(r.players[0].id, 8286882);
    assert.equal(r.players[1].id, 10351992);
    assert.equal(r.players[2].id, 13745792);
    assert.equal(r.players[3].id, 7354213);
    assert.equal(r.players[4].id, 13585495);
    assert.equal(r.players[0].isHost, true);
    assert.equal(r.players[1].isHost, false);
    assert.equal(r.players[2].isHost, false);
    assert.equal(r.players[3].isHost, false);
    assert.equal(r.players[4].isHost, false);
    assert.equal(r.players[0].options, "Host");
    assert.equal(r.players[1].options, "Hidden, DoubleTime");
  });

  it("mp settings long name (15 characters)", () => {
    const p = new MpSettingsParser();
    assert.isTrue(p.feedLine("Room name: 4-5* auto host rotaion, History: https://osu.ppy.sh/mp/54581109"));
    assert.isTrue(p.feedLine("Beatmap: https://osu.ppy.sh/b/1418503 tofubeats - CANDYYYLAND feat LIZ - Pa's Lam System Remix [Nathan's Extra]"));
    assert.isTrue(p.feedLine("Team mode: HeadToHead, Win condition: Score"));
    assert.isTrue(p.feedLine("Active mods: Freemod"));
    assert.isTrue(p.feedLine("Players: 8"));
    assert.isTrue(p.feedLine("Slot 1  Not Ready https://osu.ppy.sh/u/1 0123456789abcde "));
    assert.isTrue(p.feedLine("Slot 2  No Map    https://osu.ppy.sh/u/2 ZhiZhaChn [acv] [Hidden]"));
    assert.isTrue(p.feedLine("Slot 3  Not Ready https://osu.ppy.sh/u/3 Hot Cocoa       "));
    assert.isTrue(p.feedLine("Slot 4  Not Ready https://osu.ppy.sh/u/4 POv2II          "));
    assert.isTrue(p.feedLine("Slot 6  Not Ready https://osu.ppy.sh/u/5 MONTBLANC_heart [Host]"));
    assert.isTrue(p.feedLine("Slot 8  No Map    https://osu.ppy.sh/u/6 NewRecruit_Jack "));
    assert.isTrue(p.feedLine("Slot 9  No Map    https://osu.ppy.sh/u/7 ya nunta        "));
    assert.isTrue(p.feedLine("Slot 16 Not Ready https://osu.ppy.sh/u/8 Jow             [Hidden]"));
    assert.isFalse(p.isParsing);
    assert.isNotNull(p.result);

    const r = p.result as MpSettingsResult;
    assert.equal(r.name, "4-5* auto host rotaion");
    assert.equal(r.history, "https://osu.ppy.sh/mp/54581109");
    assert.equal(r.beatmapUrl, "https://osu.ppy.sh/b/1418503");
    assert.equal(r.beatmapTitle, "tofubeats - CANDYYYLAND feat LIZ - Pa's Lam System Remix [Nathan's Extra]");
    assert.equal(r.teamMode, "HeadToHead");
    assert.equal(r.winCondition, "Score");
    assert.equal(r.activeMods, "Freemod");
    assert.equal(r.players.length, 8);
    assert.equal(r.players[0].name, "0123456789abcde");
    assert.equal(r.players[1].name, "ZhiZhaChn [acv]");
    assert.equal(r.players[2].name, "Hot Cocoa");
    assert.equal(r.players[3].name, "POv2II");
    assert.equal(r.players[4].name, "MONTBLANC_heart");
    assert.equal(r.players[0].id, 1);
    assert.equal(r.players[1].id, 2);
    assert.equal(r.players[2].id, 3);
    assert.equal(r.players[3].id, 4);
    assert.equal(r.players[4].id, 5);
    assert.equal(r.players[0].isHost, false);
    assert.equal(r.players[1].isHost, false);
    assert.equal(r.players[2].isHost, false);
    assert.equal(r.players[3].isHost, false);
    assert.equal(r.players[4].isHost, true);
    assert.equal(r.players[1].options, "Hidden");
    assert.equal(r.players[4].options, "Host");
    assert.equal(r.players[7].options, "Hidden");
  });

  it("mp settings host and mods", () => {
    const p = new MpSettingsParser();
    assert.isTrue(p.feedLine("Room name: ahr test, History: https://osu.ppy.sh/mp/54598622"));
    assert.isTrue(p.feedLine("Beatmap: https://osu.ppy.sh/b/86920 SID - Ranbu no Melody (TV Size) [Happy's Insane]"));
    assert.isTrue(p.feedLine("Team mode: HeadToHead, Win condition: Score"));
    assert.isTrue(p.feedLine("Active mods: DoubleTime, Freemod"));
    assert.isTrue(p.feedLine("Players: 1"));
    assert.isTrue(p.feedLine("Slot 1  Not Ready https://osu.ppy.sh/u/8286882 gnsksz          [Host / Hidden, HardRock]"));
    assert.isFalse(p.isParsing);
    assert.isNotNull(p.result);

    const r = p.result as MpSettingsResult;
    assert.equal(r.teamMode, "HeadToHead");
    assert.equal(r.winCondition, "Score");
    assert.equal(r.activeMods, "DoubleTime, Freemod");
    assert.equal(r.players.length, 1);
    assert.equal(r.players[0].name, "gnsksz");
    assert.equal(r.players[0].isHost, true);
    assert.equal(r.players[0].options, "Host / Hidden, HardRock");
  });

  it("mp settings twice", () => {
    const p = new MpSettingsParser();
    assert.isTrue(p.feedLine("Room name: ahr test, History: https://osu.ppy.sh/mp/54598622"));
    assert.isTrue(p.feedLine("Beatmap: https://osu.ppy.sh/b/86920 SID - Ranbu no Melody (TV Size) [Happy's Insane]"));
    assert.isTrue(p.feedLine("Team mode: HeadToHead, Win condition: Score"));
    assert.isTrue(p.feedLine("Active mods: DoubleTime, Freemod"));
    assert.isTrue(p.feedLine("Players: 1"));
    assert.isTrue(p.feedLine("Slot 1  Not Ready https://osu.ppy.sh/u/8286882 gnsksz          [Host / Hidden, HardRock]"));
    assert.isFalse(p.isParsing);
    assert.isNotNull(p.result);

    const r1 = p.result as MpSettingsResult;
    assert.equal(r1.teamMode, "HeadToHead");
    assert.equal(r1.winCondition, "Score");
    assert.equal(r1.activeMods, "DoubleTime, Freemod");
    assert.equal(r1.players.length, 1);
    assert.equal(r1.players[0].name, "gnsksz");
    assert.equal(r1.players[0].id, 8286882);
    assert.equal(r1.players[0].isHost, true);
    assert.equal(r1.players[0].options, "Host / Hidden, HardRock");
    assert.isTrue(p.isParsed);
    assert.isFalse(p.isParsing);

    assert.isTrue(p.feedLine("Room name: 4-5* auto host rotaion, History: https://osu.ppy.sh/mp/54581109"));
    assert.isTrue(p.feedLine("Beatmap: https://osu.ppy.sh/b/1418503 tofubeats - CANDYYYLAND feat LIZ - Pa's Lam System Remix [Nathan's Extra]"));
    assert.isTrue(p.feedLine("Team mode: HeadToHead, Win condition: Score"));
    assert.isTrue(p.feedLine("Active mods: Freemod"));
    assert.isTrue(p.feedLine("Players: 1"));
    assert.isTrue(p.feedLine("Slot 1  Not Ready https://osu.ppy.sh/u/2 0123456789abcde "));
    assert.isTrue(p.isParsed);
    assert.isFalse(p.isParsing);
    assert.isNotNull(p.result);

    const r2 = p.result as MpSettingsResult;
    assert.equal(r2.name, "4-5* auto host rotaion");
    assert.equal(r2.history, "https://osu.ppy.sh/mp/54581109");
    assert.equal(r2.beatmapUrl, "https://osu.ppy.sh/b/1418503");
    assert.equal(r2.beatmapTitle, "tofubeats - CANDYYYLAND feat LIZ - Pa's Lam System Remix [Nathan's Extra]");
    assert.equal(r2.teamMode, "HeadToHead");
    assert.equal(r2.winCondition, "Score");
    assert.equal(r2.activeMods, "Freemod");
    assert.equal(r2.players.length, 1);
    assert.equal(r2.players[0].name, "0123456789abcde");
    assert.notEqual(r1, r2);
  });

  it("mp settings team", () => {
    const p = new MpSettingsParser();
    assert.isTrue(p.feedLine("Room name: ahr test, History: https://osu.ppy.sh/mp/54598622"));
    assert.isTrue(p.feedLine("Beatmap: https://osu.ppy.sh/b/86920 SID - Ranbu no Melody (TV Size) [Happy's Insane]"));
    assert.isTrue(p.feedLine("Team mode: TeamVs, Win condition: Score"));
    assert.isTrue(p.feedLine("Active mods: DoubleTime, Freemod"));
    assert.isTrue(p.feedLine("Players: 1"));
    assert.isTrue(p.feedLine("Slot 1  Not Ready https://osu.ppy.sh/u/8286882 gnsksz          [Host / Team Blue / Hidden, HardRock]"));
    assert.isFalse(p.isParsing);
    assert.isNotNull(p.result);

    const r = p.result as MpSettingsResult;
    assert.equal(r.teamMode, "TeamVs");
    assert.equal(r.winCondition, "Score");
    assert.equal(r.activeMods, "DoubleTime, Freemod");
    assert.equal(r.players.length, 1);
    assert.equal(r.players[0].name, "gnsksz");
    assert.equal(r.players[0].id, 8286882);
    assert.equal(r.players[0].isHost, true);
    assert.equal(r.players[0].options, "Host / Team Blue / Hidden, HardRock");
    assert.equal(r.players[0].team, Teams.Blue);
  });
  it("check cases", () => {
    const p = new MpSettingsParser();
    for (let key in MpSettingsCases) {
      const c = MpSettingsCases[key];
      for (let t of c.texts) {
        p.feedLine(t);
      }
      assert.isTrue(p.isParsed, c.title);
      assert.deepEqual(p.result, c.result, c.title);
    }
  });
});
