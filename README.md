## O aplikaciji

TurnirNet omogućava korisnicima da kreiraju turnire za razne igre (FIFA, Catan, kviz veče i sl.), postavljaju maksimalan broj učesnika i upravljaju prijavama. Drugi korisnici mogu da pregledaju dostupne turnire i prijavljuju se na njih.

### Glavne funkcionalnosti

- Registracija i prijava korisnika
- Pregled liste svih dostupnih turnira
- Kreiranje turnira sa mogućnošću dodavanja ko-organizatora
- Prijava na turnir sa proverom kapaciteta i duplikata
- Prihvatanje i odbijanje prijava (organizator)
- Automatsko zatvaranje turnira kada se popune mesta
- Pregled sopstvenih turnira i prijava

## Tehnologije

- **React Native** (Expo SDK 54) — mobilna aplikacija
- **Expo Router** — navigacija između ekrana
- **Supabase Auth** (REST API) — autentifikacija korisnika
- **Supabase PostgreSQL** (PostgREST) — baza podataka i REST API
- **AsyncStorage** — lokalno čuvanje tokena

## Pokretanje projekta

1. Kloniraj repozitorijum

```bash
git clone https://github.com/suzanatesovic03/mobilno-racunarstvo-turniri-app.git
cd mobilno-racunarstvo-turniri-app
```

2. Instaliraj zavisnosti

```bash
npm install
```

3. Napravi `.env` fajl u root-u projekta

```
EXPO_PUBLIC_SUPABASE_URL=tvoj_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tvoj_anon_key
```

4. Pokreni aplikaciju

```bash
npx expo start
```

5. Skeniraj QR kod u Expo Go aplikaciji na telefonu

## Struktura projekta

```
app/                    # Expo Router rute
src/
  api/                  # REST API pozivi ka Supabase-u
    supabase.js         # Auth API (login, register, logout)
    tournaments.js      # CRUD operacije nad turnirima
    applications.js     # Upravljanje prijavama
    organizers.js       # Ko-organizatori
  screens/              # Ekrani aplikacije
    LoginScreen.js
    RegisterScreen.js
    TournamentsScreen.js
    CreateTournamentScreen.js
    TournamentDetailScreen.js
    MyTournamentsScreen.js
    MyApplicationsScreen.js
  context/
    AuthContext.js      # Globalno stanje autentifikacije
  components/
    BottomNav.js        # Navigacija na dnu ekrana
```

## Baza podataka

- `profiles` — podaci o korisnicima
- `tournaments` — turniri
- `applications` — prijave korisnika na turnire
- `tournament_organizers` — N:M veza između turnira i ko-organizatora
