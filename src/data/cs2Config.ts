import { autoexecLines } from "./autoexecLines";

export const SENSITIVE = /password|token|secret|api_key|\bkey\b/i;

export const sanitize = (lines: string[]) => lines.filter((l) => !SENSITIVE.test(l));

export const settings = {
  sensitivity: "1",
  resolution: "1280 × 960",
  refreshRate: "144 Hz",
  fullscreen: "ON",
  vsync: "OFF",
  msaa: "4X",
};

export const viewmodel = {
  viewmodel_fov: "68",
  viewmodel_offset_x: "2.5",
  viewmodel_offset_y: "2",
  viewmodel_offset_z: "-2",
};

export const crosshairCode = "CSGO-DxdHJ-Wf3c6-Wv4qQ-EtskU-fcEBM";

export const crosshair: Record<string, string> = {
  cl_crosshairstyle: "4",
  cl_crosshairsize: "1",
  cl_crosshairthickness: "0.5",
  cl_crosshairgap: "-3",
  cl_crosshair_drawoutline: "0",
  cl_crosshairdot: "1",
  cl_crosshair_t: "0",
  cl_crosshairusealpha: "1",
  cl_crosshairalpha: "255",
  cl_crosshair_recoil: "0",
  cl_crosshairgap_useweaponvalue: "0",
  cl_crosshaircolor: "5",
  cl_crosshair_sniper_width: "1",
  cl_crosshair_friendly_warning: "1",
};

export const video: [string, string][] = [
  ["Resolution", "1280 × 960"],
  ["Refresh Rate", "144 Hz"],
  ["Fullscreen", "ON"],
  ["V-Sync", "OFF"],
  ["MSAA", "4X"],
  ["Shader Quality", "High"],
  ["Texture Filtering", "5"],
  ["Shadow Quality", "High"],
  ["Dynamic Shadows", "ON"],
  ["Texture Detail", "High"],
  ["Particle Detail", "High"],
  ["Ambient Occlusion", "High"],
  ["Low Latency", "ON"],
  ["FSR", "OFF"],
];

export const launchOptions =
  "-high +exec autoexec.cfg -w 1280 -h 960 -tickrate 128 -freq 144 -noaafonts -novid -noreflex +exec viewmodelup.cfg";

export const binds: Record<string, string> = {
  "1": "slot1",
  "2": "slot2",
  "3": "slot3",
  "4": "slot4",
  "5": "slot5",
  q: "lastinv",
  b: "buymenu",
  c: "slot11",
  d: "+right",
  e: "+use",
  f: "+lookatweapon",
  g: "drop",
  i: "exec meow",
  k: "radio",
  l: "buy ak47;buy rifle1",
  m: "teammenu",
  n: "noclip",
  o: "slot6",
  p: "slot10",
  a: "+left",
  r: "+reload",
  s: "+back",
  t: "+spray_menu",
  u: "messagemode2",
  v: "say working",
  x: "+voicerecord",
  y: "messagemode",
  w: "+forward",
  "'": "toggleconsole",
  ",": "buyammo1",
  ".": "buyammo2",
  "\\": "radio3",
  CapsLock: "switchhands",
  SPACE: "+jump",
  TAB: "+showscores",
  ESCAPE: "cancelselect",
  DEL: "mute",
  SHIFT: "+sprint",
  CTRL: "+duck",
  LEFTARROW: "+turnleft",
  RIGHTARROW: "+turnright",
  F3: "askconnect_accept",
  F4: "bug",
  F5: "jpeg",
  F6: "save quick",
  F10: "quit prompt",
  MOUSE1: "+attack",
  MOUSE2: "+attack2",
  MOUSE3: "player_ping",
  MOUSE4: "slot8",
  MOUSE5: "slot7",
  MWHEELUP: "+use",
  MWHEELDOWN: "+jump",
};

/** cvars used by `find` and TAB autocompletion */
export const cvars: Record<string, string> = {
  sensitivity: settings.sensitivity,
  ...viewmodel,
  ...crosshair,
  cl_radar_scale: "0.4",
  cl_radar_always_centered: "0",
  cl_radar_icon_scale_min: "0.6",
  cl_radar_rotate: "1",
  cl_hud_color: "0",
  cl_hud_radar_scale: "1",
  cl_showfps: "0",
  cl_showloadout: "1",
  hud_scaling: "0.85",
  m_rawinput: "1",
  m_yaw: "0.022",
  m_pitch: "0.022",
  zoom_sensitivity_ratio: "1",
  fps_max: "400",
  mat_vsync: "0",
  r_low_latency: "1",
};

export const viewmodelCfgLines = [
  "viewmodel_fov 68.000000;",
  "viewmodel_offset_x 2.5;",
  "viewmodel_offset_y 2;",
  "viewmodel_offset_z -2;",
];

export const videoCfgLines = [
  '"video.cfg"',
  "{",
  '\t"setting.defaultres"\t\t"1280"',
  '\t"setting.defaultresheight"\t\t"960"',
  '\t"setting.refreshrate_numerator"\t\t"144001"',
  '\t"setting.refreshrate_denominator"\t\t"1000"',
  '\t"setting.fullscreen"\t\t"1"',
  '\t"setting.mat_vsync"\t\t"0"',
  '\t"setting.nowindowborder"\t\t"1"',
  '\t"setting.shaderquality"\t\t"1"',
  '\t"setting.r_texturefilteringquality"\t\t"5"',
  '\t"setting.msaa_samples"\t\t"4"',
  '\t"setting.videocfg_shadow_quality"\t\t"3"',
  '\t"setting.videocfg_dynamic_shadows"\t\t"1"',
  '\t"setting.videocfg_texture_detail"\t\t"2"',
  '\t"setting.videocfg_particle_detail"\t\t"3"',
  '\t"setting.videocfg_ao_detail"\t\t"3"',
  '\t"setting.videocfg_fsr_detail"\t\t"0"',
  '\t"setting.r_low_latency"\t\t"1"',
  '\t"setting.aspectratiomode"\t\t"0"',
  "}",
];

export const files = [
  {
    name: "autoexec.cfg",
    desc: "Main CS2 configuration",
    meta: "140+ commands",
    lines: sanitize(autoexecLines),
  },
  {
    name: "viewmodelup.cfg",
    desc: "Current viewmodel",
    meta: "4 commands",
    lines: viewmodelCfgLines,
  },
  {
    name: "cs2_video.txt",
    desc: "Video configuration",
    meta: "1280 × 960 / 144Hz",
    lines: videoCfgLines,
  },
] as const;
