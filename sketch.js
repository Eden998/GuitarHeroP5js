// *** general ***
let screen_size = [800, 900];
let framerate = 60;
let board_font;
let red_c = [245, 94, 66];
let yellow_c = [244, 234, 74];
let blue_c = [120, 191, 233];
let green_c = [164, 228, 80];
let purple_c = [204, 80, 230];
let colors = [red_c, yellow_c, blue_c, green_c, purple_c];
let keys = ['D', 'F', 'G', 'H', 'J'];

// *** main menu ***
let songs_list_button;
let songs_list_button_pos = [screen_size[0] / 2, 400];
let songs_list_button_text_size = 70;
let settings_button;
let settings_button_pos = [songs_list_button_pos[0], songs_list_button_pos[1] + 100];
let settings_button_text_size = 70;
let main_menu_buttons;

// *** songs list menu ***
let songs_list;
let songs_list_buttons = [];
let songs_list_buttons_text_size = 50;
let songs_list_buttons_height = 100;
let buttons_distance = 100;

// *** loading screen ***
let song_loaded = false;
let loading_circles = [];

// *** song end menu
let ending_messages = ["BIG OOF", "TRY HARDER!", "NICE!", "WELL PLAYED!", "NO WAY, 100%!!!"];
let ending_message_height = 200;
let percent_height = ending_message_height + 200;
let song_end_menu_main_menu_button_height = percent_height + 200;
let song_end_menu_main_menu_button_text_size = 100;
let song_end_menu_main_menu_button;

// *** board ***

// * notes *
let notes_num = 5;
let notes_distance = 100;
let left_note_x = 100;
let right_note_x = left_note_x + (notes_num - 1) * notes_distance;
let notes_height = screen_size[1] - 100;
let notes_radius = 40;
let notes = [];
let buttons = []
let notes_falling_velocity = 5;
let remove_miss_distance = notes_falling_velocity * 6;

// * stats *
let stats_x = screen_size[0] - 150;
let score_pos = [stats_x, 100];
let score_number = [stats_x, score_pos[1] + 50];
let streak_pos = [stats_x, score_pos[1] + 200];
let streak_number = [stats_x, streak_pos[1] + 50];
let streak_rect = [stats_x, streak_number[1] + 100, 50, 150];
let multiplayer_pos = [stats_x, streak_rect[1] + 120];
let pause_button;
let pause_size = 60;
let pause_pos = [stats_x + 100, 100]

// pause menu
let return_to_menu_button;
let return_to_menu_button_pos = [screen_size[0] / 2, 400];
let return_to_menu_button_text_size = 70;
let continue_button;
let continue_button_pos = [songs_list_button_pos[0], songs_list_button_pos[1] + 100];
let continue_button_text_size = 70;
let pause_buttons;

// *** FFT algorithm ***
let fft_bins = 64;
let prev_sound = 0
let sound_threshold = 100

// *** sound and notes timing ***
let default_timer = 0.2;
let notes_falling_distance = notes_height + (notes_radius / 2)
let notes_falling_time = (notes_falling_distance / notes_falling_velocity) / framerate;
let playing_sound_active = false;
let notes_time = 0;
let notes_prev_frame;
let playing_notes = false;
let offset = -0.05;
let curr_note = 0;

// *** gameplay ***
let base_note_score = 50;
let score = 0;
let streak = 0;
let multiplayer = 1;
let note_hits = 0;

// *** screen control ***
let main_menu = true;
let songs_list_menu = false;
let loading = false;
let song_end_menu = false;
let settings = false;
let gameplay = false;
let pause = false;

function preload() {
  board_font = loadFont("assets/board_font.ttf")
  songs_list = loadStrings('assets/SongsList.txt');
}

let cnv;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  frameRate(framerate);
  
  textSize(70);
  textAlign(CENTER);
  textFont(board_font)
  rectMode(CENTER)
  
  fft = new p5.FFT(0.9, fft_bins);
  
  update_components_pos();
}

function update_buttons(){
  //main menu initialize
  songs_list_button = new MenuButton(songs_list_button_pos[0], songs_list_button_pos[1], "Songs List", songs_list_button_text_size, board_font, "songs list");
  settings_button = new MenuButton(settings_button_pos[0], settings_button_pos[1], "Settings", settings_button_text_size, board_font, "settings");
  main_menu_buttons = [songs_list_button, settings_button];
  
  //gameplay initialize
  buttons = []
  for (let i = 0; i < notes_num; i++) {
    let button = new Button(left_note_x + notes_distance * i, notes_height, colors[i], keys[i], notes_radius);
    buttons.push(button);
  }
  pause_button = new MenuButton(pause_pos[0], pause_pos[1] , "| |", pause_size, board_font, "pause");
  
  //songs list menu initialize
  songs_list_buttons = []
  for (let i = 0 ; i < songs_list.length ; i++){
    let song_button = new MenuButton(screen_size[0] / 2, songs_list_buttons_height + i * buttons_distance, songs_list[i], songs_list_buttons_text_size, board_font, "loading", colors[i % 5]);
    songs_list_buttons.push(song_button)
  } 
  
  // loading screen initialize
  loading_circles = []
  for (let i = 0 ; i < 5 ; i++){
    let loading_circle = new LoadingCircle(screen_size[0] / 2 - 200 + 100 * i, screen_size[1] / 2, colors[i], (5 - i) * 6);
    loading_circles.push(loading_circle)
  }
  //song end menu initialize
  song_end_menu_main_menu_button = new MenuButton(screen_size[0] / 2, song_end_menu_main_menu_button_height, "Main Menu", song_end_menu_main_menu_button_text_size, board_font, "main menu");
  
  //pause menu initialize
  return_to_menu_button = new MenuButton(return_to_menu_button_pos[0], return_to_menu_button_pos[1], "Main Menu", return_to_menu_button_text_size, board_font, "main menu");
  continue_button = new MenuButton(continue_button_pos[0], continue_button_pos[1], "Continue", continue_button_text_size, board_font, "gameplay");
  pause_buttons = [return_to_menu_button, continue_button];
}

function draw() {
  if (main_menu){
    draw_main_menu();
  }
  else if(songs_list_menu){
    draw_songs_list_menu();
  }
  else if(loading){
    draw_loading();
  }
  else if(gameplay){
    draw_gameplay();
  }
  else if(song_end_menu){
    draw_song_end_menu();
  }
  else if(pause){
    draw_pause();
  }
}

function reset_stats(){
  notes = [];
  notes_time = 0;
  song_loaded = false;
  playing_notes = false;
  playing_sound_active = false;
  curr_note = 0;
  score = 0;
  streak = 0;
  multiplayer = 1;
  note_hits = 0;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
  update_components_pos();
}

function update_components_pos(){
  screen_size = [windowWidth, 900];

  // *** main menu ***
  songs_list_button_pos = [windowWidth / 2, 400];
  songs_list_button_text_size = 70;
  settings_button_pos = [windowWidth / 2, songs_list_button_pos[1] + 100];
  settings_button_text_size = 70;

  // *** songs list menu ***
  songs_list_buttons = [];
  songs_list_buttons_text_size = 50;
  songs_list_buttons_height = 100;
  buttons_distance = 100;

  // *** loading screen ***
  song_loaded = false;
  loading_circles = [];
  
  // *** song end menu
  ending_messages = ["BIG OOF", "TRY HARDER!", "NICE!", "WELL PLAYED!", "NO WAY, 100%!!!"];
  ending_message_height = 200;
  percent_height = ending_message_height + 200;
  song_end_menu_main_menu_button_height = percent_height + 200;
  song_end_menu_main_menu_button_text_size = 100;

  // *** board ***

  // * notes *
  left_note_x = screen_size[0] / 2 - 300;
  right_note_x = left_note_x + (notes_num - 1) * notes_distance;
  notes_height = screen_size[1] - 100;

  // * stats *
  stats_x = screen_size[0] / 2 + 250;
  score_pos = [stats_x, 100];
  score_number = [stats_x, score_pos[1] + 50]
  streak_pos = [stats_x, score_pos[1] + 200]
  streak_number = [stats_x, streak_pos[1] + 50]
  streak_rect = [stats_x, streak_number[1] + 100, 50, 150];
  multiplayer_pos = [stats_x, streak_rect[1] + 120]
  pause_pos = [stats_x + 140, 80]
  
  // *** pause menu ***
  return_to_menu_button_pos = [screen_size[0] / 2, 400];
  continue_button_pos = [songs_list_button_pos[0], songs_list_button_pos[1] + 100];
  
  update_buttons();
}

function mousePressed(){
  if (main_menu){
    for(let i = 0 ; i < main_menu_buttons.length ; i++){
      let check_curr_button = main_menu_buttons[i].is_clicked();
      if (check_curr_button != null){
        change_screens(check_curr_button);
      }
    }
  }
  else if(songs_list_menu){
    for(let i = 0 ; i < songs_list_buttons.length ; i++){
      let check_curr_button = songs_list_buttons[i].is_clicked();
      if (check_curr_button != null){
        load_song(songs_list[i]);
        change_screens(check_curr_button);
      }
    }
  }
  else if(gameplay){
    let check_curr_button = pause_button.is_clicked()
    if (check_curr_button != null){
      toggle_gameplay();
      change_screens(check_curr_button);
    }
  }
  
  else if(song_end_menu){
    let check_curr_button = song_end_menu_main_menu_button.is_clicked();
    if (check_curr_button != null){
      change_screens(check_curr_button);
      reset_stats();
    }
  }
  else if(pause){
    for(let i = 0 ; i < pause_buttons.length ; i++){
      let check_curr_button = pause_buttons[i].is_clicked();
      if (check_curr_button != null){
        change_screens(check_curr_button);
        if (check_curr_button == "main menu"){
          reset_stats();
        }
        else{
          toggle_gameplay();
        }
      }
    }
  }
}

function draw_main_menu(){
  background(0);
  for(let i = 0 ; i < main_menu_buttons.length ; i++){
    main_menu_buttons[i].draw();
  }
}

function draw_songs_list_menu(){
  background(0);
  for(let i = 0 ; i < songs_list_buttons.length ; i++){
    songs_list_buttons[i].draw();
  }
}

function draw_loading(){
  background(0);
  for (let i = loading_circles.length - 1 ; i >= 0 ; i--){
    loading_circles[i].update_size();
    loading_circles[i].draw();
  }
}

function draw_song_end_menu(){
  background(0)
  let percent = int((note_hits * 100) / table.getRowCount());
  let ending_message_index = int((percent * (ending_messages.length - 1)) / 100)
  textSize(song_end_menu_main_menu_button_text_size)
  text(ending_messages[ending_message_index], screen_size[0] / 2, ending_message_height)
  text(percent + "%", screen_size[0] / 2, percent_height)
  song_end_menu_main_menu_button.draw();
}

function draw_gameplay(){
  background(0);
  if (!playing_sound_active && notes_time >= notes_falling_time + offset){
    activate_sound();
  }
  if (notes_time > playing_sound.duration()){
    show_song_end_menu();
  }
  sound_analize();
  draw_note_lines();
  if (playing_notes){
    update_notes();
  }
  draw_notes();
  draw_buttons();
  draw_stats();
  pause_button.draw();
}

function draw_pause(){
  background(0);
  for(let i = 0 ; i < pause_buttons.length ; i++){
    pause_buttons[i].draw();
  }
}

function keyPressed(){
  key_pressed = key.toUpperCase()
  if (keys.includes(key_pressed)){
    check_note(key_pressed);
  }
}

function change_screens(screen){
  main_menu = false;
  songs_list_menu = false;
  song_end_menu = false;
  loading = false;
  settings = false;
  gameplay = false;
  if (screen == "gameplay")
    gameplay = true;
  else if(screen == "songs list")
    songs_list_menu = true;
  else if(screen == "loading")
    loading = true;
  //else if(screen == "settings")
  //  settings = true;
  else if(screen == "main menu")
    main_menu = true;
  else if(screen == "end song menu")
    song_end_menu = true;
  else if(screen == "pause")
    pause = true;
  else
    main_menu = true;
}

function show_song_end_menu(){
  change_screens("end song menu");
}

function draw_note_lines() {
  stroke(255);
  strokeWeight(1);
  for (let i = 0; i < notes_num; i++) {
    line(left_note_x + notes_distance * i, notes_height - notes_radius / 2, left_note_x + notes_distance * i, 0);
  }
}

function draw_buttons(){
  for (let i = 0; i < notes_num; i++) {
    buttons[i].draw();
  }
}

function draw_notes(){
  for (let i = 0; i < notes.length ; i++){
    if (playing_notes){
      notes[i].update();
    }
    notes[i].draw();
  }
}

function draw_stats(){
  textSize(40);
  draw_score();
  draw_notes_streak();
}

function draw_score() {
  stroke(255);
  strokeWeight(0);
  fill(255, 255, 255);
  text("Score:", score_pos[0], score_pos[1]);
  text(score, score_number[0], score_number[1]);
}

function draw_notes_streak() {
  stroke(255);
  strokeWeight(0);
  fill(255);
  text("Combo:", streak_pos[0], streak_pos[1]);
  text(streak, streak_number[0], streak_number[1]);
  draw_streak_bar();
  draw_multiplayer();
}

function draw_streak_bar(){
  stroke(255);
  strokeWeight(3);
  fill(0);
  rect(streak_rect[0], streak_rect[1], streak_rect[2], streak_rect[3] + 7, 10);
  strokeWeight(0);
  fill(colors[multiplayer - 1]);
  let curr_rect_y = streak_rect[1] + streak_rect[3] / 2 - 7;
  let distance_rect = streak_rect[3] / 10;
  if (streak < 50){
    for(let i = 0 ; i < streak % 10 ; i++){
      rect(streak_rect[0], curr_rect_y, streak_rect[2] - 10, streak_rect[3] / 10 - 1, 20);
      curr_rect_y -= distance_rect;
    }
  }
  else{
    for(let i = 0 ; i < 10 ; i++){
      rect(streak_rect[0], curr_rect_y, streak_rect[2] - 10, streak_rect[3] / 10 - 1, 20);
      curr_rect_y -= distance_rect;
    }
  }
}

function draw_multiplayer(){
  stroke(colors[multiplayer - 1]);
  strokeWeight(1);
  text("X" + str(multiplayer), multiplayer_pos[0], multiplayer_pos[1]);
}

function toggle_gameplay() {
  if (playing_notes) {
    playing_notes = false;
  } 
  else{
    playing_notes = true;
    notes_prev_frame = millis();
  }
  if (playing_sound.isPlaying()) {
    playing_sound.pause();
  } 
  else if(playing_sound_active) {
   playing_sound.play();
  }
}

function sound_analize(){
  let spectrum = fft.analyze();
  sound_draw(spectrum);
}

function sound_draw(spectrum){
  strokeWeight(15);
  stroke(255, 255, 255, 50);
  for(let i = 0 ; i < spectrum.length / 4 ; i++){
    let x = map(i, 0, fft_bins / 4, left_note_x - notes_radius / 2, right_note_x + notes_radius / 2 + 30);
    let y = screen_size[1] - map(spectrum[i], 0, 256, 0, screen_size[1]);
    line(x, screen_size[1], x, y);
  }
}

function update_notes(){
  update_notes_time();
  if (curr_note < table.getRowCount()){
    if(notes_time >= table.getNum(curr_note, 1)){
      send_note();
      curr_note += 1;
    }
  }
  remove_notes();
}

function update_notes_time(){
  if (playing_notes){
    notes_time += (millis() - notes_prev_frame) / 1000;
    notes_prev_frame = millis();
  }  
}

function send_note(){
  rand_index = Math.floor(Math.random()*colors.length);
  let color = colors[rand_index];
  let note = new Note(color, left_note_x + notes_distance * rand_index, notes_radius - 5, notes_falling_velocity);
  notes.push(note);
}

function check_note(key_pressed){
  let key_index = keys.indexOf(key_pressed);
  if (notes.length > 0){
    if (notes[0].get_pos_x() == buttons[key_index].get_pos_x()){
      curr_pos = notes[0].get_pos_y();
      if (abs(curr_pos - notes_height) <= 50){
        streak += 1;
        note_hits += 1;
        score += base_note_score * multiplayer;
        buttons[key_index].note_hit(multiplayer);
      }
      else{
        reset_streak();
      }
      update_multiplayer();
      notes.shift();
    }
    else{
      reset_streak();
    }
  }
}

function update_multiplayer(){
  if (streak == 10)
    multiplayer = 2;
  if (streak == 20)
    multiplayer = 3;
  if (streak == 30)
    multiplayer = 4;
  if (streak == 40)
    multiplayer = 5;
}

function remove_notes(){
  if (notes.length > 0){
    if (notes[0].get_pos_y() >= notes_height + remove_miss_distance){
      notes.shift();
      reset_streak();
    }
  }
}

function reset_streak(){
  multiplayer = 1;
  streak = 0;
}

function load_song(song_name){
  song_folder = "assets/" + song_name + "/"
  playing_sound = loadSound(song_folder + song_name + ".mp3", loading_complete);
  table = loadTable(song_folder + song_name + '.csv', 'csv', 'header');
}

function loading_complete(){
  song_loaded = true;
  change_screens("gameplay");
  toggle_gameplay();
}

function activate_sound(){
  playing_sound.amp(0.1);
  playing_sound.play();
  playing_sound_active = true;
}
