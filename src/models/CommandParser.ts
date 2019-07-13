export class CommandParser {

  ParseBanchoResponse(message: string): BanchoResponse {
    const m_joined = message.match(/(.+) joined in slot (\d+)\./);
    if (m_joined) {
      return new BanchoResponse(BanchoResponseType.PlayerJoined, m_joined[1]).setSlot(parseInt(m_joined[2]));
    }

    const m_left = message.match(/(.+) left the game\./);
    if (m_left) {
      return new BanchoResponse(BanchoResponseType.PlayerLeft, m_left[1]);
    }

    if (message == "Host is changing map...") {
      return new BanchoResponse(BanchoResponseType.BeatmapChanging);
    }

    const m_map = message.match(/Beatmap changed to\: .+ \[.+\] \(https:\/\/osu.ppy.sh\/b\/(\d+)\)/);
    if (m_map) {
      return new BanchoResponse(BanchoResponseType.BeatmapChanged, m_map[1]);
    }

    const m_host = message.match(/(.+) became the host\./);
    if (m_host) {
      return new BanchoResponse(BanchoResponseType.HostChanged, m_host[1]);
    }

    if (message == "The match has started!") {
      return new BanchoResponse(BanchoResponseType.MatchStarted);
    }

    const m_finish = message.match(/(.+) finished playing \(Score: (\d+), (PASSED|FAILED)\)\./);
    if (m_finish) {
      return new BanchoResponse(BanchoResponseType.PlayerFinished, m_finish[1]).setScore(parseInt(m_finish[2]), m_finish[3] == "PASSED");
    }

    if (message == "The match has finished!") {
      return new BanchoResponse(BanchoResponseType.MatchFinished);
    }

    if (message == "Aborted the match") {
      return new BanchoResponse(BanchoResponseType.AbortedMatch);
    }

    if (message == "User not found") {
      return new BanchoResponse(BanchoResponseType.UserNotFound);
    }
    return new BanchoResponse(BanchoResponseType.None);
  }

  ParseMpMakeResponse(nick: string, message: string): { id: string, title: string } | null {
    if (nick != "BanchoBot") return null;
    const reg = /Created the tournament match https:\/\/osu.ppy.sh\/mp\/(\d+) (.+)/;
    const res = message.match(reg);
    if (res) {
      return { id: res[1], title: res[2] };
    }
    return null;
  }

  ParseMPCommand(message: string): MpCommand | null {
    const reg = /^!mp/;
    message = message.toLowerCase();
    const res = message.match(reg);
    if (res) {
      let [_mp, command, ...args] = message.split(' ');
      switch (command) {
        case "make":
        case "invlide":
        case "host":
          const username = args.join(" ");
          return { command: command, args: [username] };

        default:
          return { command: command, args: args };
      }
    }
    return null;
  }
}

export interface MpCommand {
  command: string;
  args: string[];
}

export enum BanchoResponseType {
  None,
  PlayerJoined,
  PlayerLeft,
  BeatmapChanging,
  BeatmapChanged,
  HostChanged,
  MatchStarted,
  PlayerFinished,
  MatchFinished,
  AbortedMatch,
  UserNotFound
}

export class BanchoResponse {
  type: BanchoResponseType;
  id: string;
  slot: number;
  score: number;
  isPassed: boolean;
  constructor(type: BanchoResponseType, id?: string) {
    this.type = type;
    this.id = id || "";
    this.slot = 0;
    this.score = 0;
    this.isPassed = false;
  }
  
  setSlot(slot: number): BanchoResponse {
    this.slot = slot;
    return this;
  }
  setScore(score: number, passed: boolean): BanchoResponse {
    this.score = score;
    this.isPassed = passed;
    return this;
  }
}