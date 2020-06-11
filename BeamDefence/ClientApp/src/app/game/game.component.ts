import { Component, OnInit } from '@angular/core';
import * as p5 from "p5";
import * as signalR from "@microsoft/signalr"
import { IPlayer } from '../models/player';
import { IEnemy } from '../models/enemy';
import { Spark } from '../models/spark';
import { TowerDrawer } from '../drawers/towerDrawer';
import { EnemyDrawer } from '../drawers/enemyDrawer';
import { BaseDrawer } from '../drawers/baseDrawer';
import { TextUtils } from '../utils/text';

@Component({
  selector: 'app-game-component',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  connection: signalR.HubConnection;
  live: boolean = false;
  id: number = -1;
  score: number = 0;
  remainingBaseHealth: number = 100;
  waveNumber: number = 0;
  waveStarting = false;
  highScore: number = 0;
  players: IPlayer[] = [];
  enemies: IEnemy[] = [];
  deadEnemies: IEnemy[] = [];
  sparks: Spark[] = [];
  canvas: any;
  firstGame: boolean = true;

  async ngOnInit() {
    this.getHighScore();

    this.connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44367/gameHub")
      .withAutomaticReconnect()
      .build();
      
    this.connection.on("receivePlayers", this.receivePlayers);
    this.connection.on("receiveId", this.receiveId);
    this.connection.on("receiveGameState", this.receiveGameState);
    this.connection.on("receiveEnemies", this.receiveEnemies);
    this.connection.on("updateMousePositions", this.updateMousePositions);
    this.connection.on("newPlayer", this.newPlayer);
    this.connection.on("playerLeft", this.playerLeft);
    this.connection.on("gameStarted", this.gameStarted);
    this.connection.on("newWave", this.newWave);
    this.connection.on("sendEnemiesForConnection", this.sendEnemiesForConnection);
    this.connection.on("newEnemies", this.newEnemies);
    this.connection.on("enemyDead", this.enemyDead);
    this.connection.on("enemyArrived", this.enemyArrived);
    this.connection.on("gameOver", this.gameOver);
    
    await this.connection.start();
    await this.connection.invoke("GetPlayers");
    await this.connection.invoke("GetGameState");

    const sketch = sketch => {
      sketch.setup = () => {
        let canvas2 = sketch.createCanvas(1440, 810);
        canvas2.parent('sketch-holder');
        sketch.background(10);
      };
      
      sketch.draw = () => {
        this.connection.invoke("SendMouse", sketch.mouseX, sketch.mouseY);

        sketch.background(10);

        BaseDrawer.draw(sketch, this.remainingBaseHealth);

        this.players.forEach((player, index) => {
            var towerDrawer = new TowerDrawer(sketch, player, index, this.players.length);
            towerDrawer.draw(this.enemies, (colour: any, enemy: IEnemy, hitLocation: {x: number, y: number}) => {            
              this.addSpark(colour, hitLocation.x, hitLocation.y);
      
              if (player.id == this.id) {
                this.connection.invoke("DamageEnemy", enemy.id);
              }
            });
        });

        if (this.live){
          this.enemies.forEach(e => {
            var enemyDrawer = new EnemyDrawer(sketch, e);
            var arrived = enemyDrawer.draw();
            if (arrived) this.connection.invoke("EnemyArrived", e.id);
          });
        }
        else if (!this.firstGame) {
          this.deadEnemies.forEach(e => {
            var enemyDrawer = new EnemyDrawer(sketch, e);
            enemyDrawer.drawDead();
          });          
    
          this.addSpark(sketch.color(255, 255, 255), sketch.width/2, sketch.height/2);
        }
  
        this.sparks = this.sparks.filter(s => s.draw(sketch));

        this.drawText(sketch);
      };      

      sketch.keyPressed = () => {
        if (sketch.key == "s" && !this.live) {
          this.connection.invoke("StartGame");
        }
      }
    }

    this.canvas = new p5(sketch);
  }

  newPlayer = (newPlayer: IPlayer) => this.players.push(newPlayer);
  
  receiveId = (ourId: number) => this.id = ourId;

  receivePlayers = (players: IPlayer[]) => this.players = players;

  receiveGameState = (live: boolean) => {
    this.live = live;
    if (live) this.connection.invoke("GetEnemies");
  }

  receiveEnemies = (enemies: IEnemy[]) => this.enemies = enemies;

  playerLeft = (id: number) => this.players = this.players.filter(p => p.id != id);
  
  gameStarted = () => {
    this.live = true;
    this.remainingBaseHealth = 100;
    this.score = 0;
  }
  
  newWave = () => {
    this.waveNumber += 1;
    this.waveStarting = true;
    setTimeout(() => this.waveStarting = false, 2000);
  }
  
  sendEnemiesForConnection = (connectionId: string) => {
    var positions = this.enemies.map(e => ({x: e.position.x, y: e.position.y, id: e.id}));
    this.connection.invoke("SendEnemiesForConnection", positions, connectionId);
  }

  newEnemies = (enemies: IEnemy[]) => this.enemies.push(...enemies);

  enemyDead = (id: number) => {
    var enemy = this.enemies.find(e => e.id == id);
    if (enemy != undefined) this.score += enemy.score;
    this.enemies = this.enemies.filter(e => e.id != id);
  }
  
  enemyArrived = (id: number) => {
    var enemy = this.enemies.find(e => e.id == id);
    if (enemy != undefined) this.remainingBaseHealth -= enemy.damage;
    this.enemies = this.enemies.filter(e => e.id != id);
  }

  updateMousePositions = (mousePositions: {x: number, y: number}[]) => {
    if (mousePositions.length != this.players.length) return;
    this.players.forEach((player, i) => player.mouse = mousePositions[i]);
  }
  
  gameOver = () => {
    this.updateHighScore(this.score);
    this.live = false;
    this.waveNumber = 0;
    this.firstGame = false;
    this.deadEnemies = this.enemies;
    this.enemies = [];
    this.sparks = [];
  }

  updateHighScore(score: number) {
    var existingHighScore = localStorage.getItem("highScore");
    if (existingHighScore === null || parseInt(existingHighScore) < score) {
      localStorage.setItem("highScore", score.toString());
      this.highScore = score;
    }
  }

  getHighScore() {
    var highScore = localStorage.getItem("highScore");
    if (highScore != null) {
      this.highScore = parseInt(highScore);
    }
  }
    
  addSpark(colour, x: number, y: number) {
    this.sparks.push(new Spark(colour, x, y));
  }
    
  drawText(sketch) {
    TextUtils.bottomRightText(sketch, "Score: " + this.score);

    if (this.waveStarting) {
      TextUtils.centreText(sketch, `Wave ${this.waveNumber} incoming!`);
    }

    if (!this.live) {
      TextUtils.topRightText(sketch, "Highscore: " + this.highScore);
      TextUtils.topLeftText(sketch, "Press S to start");
    }
  }
}
