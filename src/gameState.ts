class GameState {
    private static instance: GameState;
    public birdSpeed: number;
    public birdJump: number;
    public columnGap: number;
    public columnSpeed: number;
    public isInverseMode: boolean;
    public score: number;
    public isGameStarted: boolean;
    public jumpAmount: number;
    public isJumping: boolean;

    private constructor() {
        this.birdSpeed = this.getLocalStorageNumber("bird-speed", 2);
        this.birdJump = this.getLocalStorageNumber("bird-jump", 10);
        this.columnGap = this.getLocalStorageNumber("column-gap", 5);
        this.columnSpeed = this.getLocalStorageNumber("column-speed", 2000);
        this.isInverseMode = localStorage.getItem("inversion") === "true";
        this.score = 0;
        this.isGameStarted = false;
        this.jumpAmount = 0;
        this.isJumping = false;
    }

    public static getInstance(): GameState {
        if (!GameState.instance) {
            GameState.instance = new GameState();
        }
        return GameState.instance;
    }

    public reset() {
        this.score = 0;
        this.isGameStarted = false;
        this.jumpAmount = 0;
        this.isJumping = false;
    }

    getLocalStorageNumber(key: string, defaultValue: number): number {
        return localStorage.getItem(key) ? Number(localStorage.getItem(key)) : defaultValue;
    }
}

export default GameState;
