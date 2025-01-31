interface GameData {
    names: string[];
    clues: string[];
    shardcastEp?: string;
}

const games: GameData[] = [
    {
        names: ['Hoid', 'Wit', 'Cephandrius'],
        clues: [
            'This character is a POV character',
            'This character can read',
            'This character is Invested',
            "This caracter is old",
            "This character goes by multiple names"
        ],
        shardcastEp: 'Hemalurgy'
    },
    {
        names: ['Sebarial'],
        clues: [
            'This character enjoys drink',
            'This character is a member of the ruling classing',
            'This character is more than they first appear',
            'This character is not Invested',
            'This character spends battles in a tent'
        ],
        shardcastEp: 'Hemalurgy'
    },
    {
        clues: [
            'This character has good aim',
            'This character has killed a member of the nobility',
            'This character sees things others do not',
            'This character has 6 children',
            'This character is not allowed to use weapons'
        ],
        names: ['']
    }
];

const clues = games.map(game => game.clues);

export { games, clues };