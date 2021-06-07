import humps from 'humps'

export interface namedFn {
    function(s: string): string
}

export const namedWays = {
    // abcDef
    0: function (s: string): string {
        return humps.camelize(s)
    },
    // AbcDef
    1: function (s: string): string {
        return humps.pascalize(s)
    },
    // abc_def
    2: function (s: string): string {
        return humps.decamelize(s, { separator: '_' })
    },
    // Abcdef
    3: function (s: string): string {
        s = humps.decamelize(s, { separator: '' })
        return s.replace(s[0], s[0].toUpperCase())
    },
    // abcdef
    4: function (s: string): string {
        return humps.decamelize(s, { separator: '' })
    }
}

export function getName(index: number, s: string): string {
    switch (index) {
        case 0:
            return namedWays[0](s)
        case 1:
            return namedWays[1](s)
        case 2:
            return namedWays[2](s)
        case 3:
            return namedWays[3](s)
        case 4:
            return namedWays[4](s)
    }
    return s
}
