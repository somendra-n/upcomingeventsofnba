from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from nba_api.stats.endpoints import scoreboardv2
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_game_datetime(game_date_str, status_text):
    et = ZoneInfo("America/New_York")
    game_date = datetime.fromisoformat(game_date_str).date()
    time_match = re.search(r'(\d{1,2}:\d{2}\s?[ap]m)', status_text, re.IGNORECASE)
    if time_match:
        time_str = time_match.group(1).strip()
        game_time = datetime.strptime(time_str, "%I:%M %p").time()
        return datetime.combine(game_date, game_time).replace(tzinfo=et).isoformat()
    return datetime.combine(game_date, datetime.min.time()).replace(tzinfo=et).isoformat()

def format_datetime(dt_iso):
    dt = datetime.fromisoformat(dt_iso)
    return dt.strftime("%b %d, %Y %I:%M %p ET")

def get_upcoming_games():
    games = []
    et_now = datetime.now(ZoneInfo("America/New_York"))

    for offset in range(20):
        date_et = (et_now + timedelta(days=offset)).strftime("%m/%d/%Y")
        scoreboard = scoreboardv2.ScoreboardV2(game_date=date_et)
        data = scoreboard.get_dict()

        headers = data['resultSets'][0]['headers']
        rows = data['resultSets'][0]['rowSet']
        line_headers = data['resultSets'][1]['headers']
        line_rows = data['resultSets'][1]['rowSet']

        for row in rows:
            game_id = row[headers.index('GAME_ID')]
            game_date = row[headers.index('GAME_DATE_EST')]
            status_text = row[headers.index('GAME_STATUS_TEXT')]

            start_datetime = parse_game_datetime(game_date, status_text)
            formatted_time = format_datetime(start_datetime)

            teams = [
                line[line_headers.index('TEAM_NAME')]
                for line in line_rows
                if line[line_headers.index('GAME_ID')] == game_id
            ]

            if len(teams) == 2:
                games.append({
                    "game_id": game_id,
                    "start_datetime": start_datetime,
                    "formatted_time": formatted_time,
                    "team1": teams[0],
                    "team2": teams[1],
                })

    return games

@app.get("/api/upcoming-matches")
def upcoming_matches():
    return {"matches": get_upcoming_games()}
