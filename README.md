# scale-caluculator-2022

This app should help you find and understand chords and keys in music, with visual aids for piano and guitar.

This is an old project from 2014, revamped with Vue3.

Todo:

- [x] Have the modes reflect the actual keys
- [x] Allow chord notes to be played either simultaneously, with fast arpeggio or with slow arpeggio
- [x] Fix the sequencer messing up the usual views now with regards to playback
- [ ] Add routing controls
- [ ] Run the compiler and get all the parts to render hosted and routed

On the sequencer:

So it feels like this is more its own thing. I'd want to enumerate some features I have in mind:
- [x] Play the sequence in a proper Tone.js way, making sure it stops after one full playback
- [x] Have the cursor move during playback
- [x] Let the last note play all the way to the end, now has a cheap solution
- [x] Allow the sequence to be stopped
- [x] Be able to play the sequence in a loop
- [x] Disable "play" when already in playback mode
- [x] Allow custom time signatures (start with 3/4 and 4/4 though)
- [x] Disallow adding new chords during playback
- [x] Create "record", which is playback but with option to add new chords
- [x] There is this strange bug that the synth has to be triggered once in order for the playback to start
- [x] Allow adding bars
- [x] Allow removing bars
- [x] Make the rows better divided
- [x] Allow save and load files
- [x] Show the notes being played per chord on a piano or guitar instrument
- [x] Add sixth chords - really inversions, but just used all the time
- [x] Fix the faulty duration of notes
- [x] Enumerate bars and counts
- [x] Add interface to name .json file
- [ ] Clean it all up!

Way in the future:
- [ ] Try and use the native loop capabilities
- [ ] Show total bars + duration of composition
- [ ] Transpose composition up or down a half step
- [ ] Add copy/paste feature
- [ ] Specify key and suggest chords that can be played
- [ ] Add a bassline so that you can create slash chords
- [ ] Save and load MIDI files
- [ ] Allow hihat metronome to play along
- [ ] Allow count-in of 1 bar
- [ ] Allow 9th, 11th and 13th extensions to the harmonies?
- [ ] Allow arbitrary alterations to the chords (b5, \#5, etc)
