type Map = { [key: string]: number; }

class CollisionGroup {

    public static categories: Map = {}
    private static lastCategoryBitField: number = 0x0001 // Default category. Increments by 0x0001, 0x0002, 0x0004, 0x0008, ...

    public interactionCategories: number[] = []
    public interactionCategoryNames: string[] = []

    constructor(interactionCategories: string[], interactsWithDefault = true) {

        // Sets default static category
        CollisionGroup.categories['default'] = 0x0001

        // Adds default category per parameter
        if (interactsWithDefault) {
            interactionCategories.push('default')
        }

        // Removes the duplicates, if any
        const interactions = interactionCategories.filter( function (element, index, self) {
            return index === self.indexOf(element)
        })

        // Adds the categories to the object
        for (const interaction of interactions) {

            let unkownCategory = true

            // Adds the existing specified category
            for (const category in CollisionGroup.categories) {
                if (interaction == category) {
                    this.interactionCategories.push(CollisionGroup.categories[category])
                    unkownCategory = false
                }
            }

            // Adds the name category names
            this.interactionCategoryNames.push(interaction)

            if (!unkownCategory) {
                continue
            }

            // Creates a new category entry and bit field if the category does not already exist
            const nextCategoryBitField = CollisionGroup.lastCategoryBitField * 2
            const nextCategoryName = interaction
            CollisionGroup.categories[nextCategoryName] = nextCategoryBitField
            CollisionGroup.lastCategoryBitField = nextCategoryBitField

            // Adds the new category to the object
            this.interactionCategories.push(CollisionGroup.categories[interaction])

        }
    }

    public encodeGroup(): number {
        let encodedGroup = 0
        for (const category of this.interactionCategories) {
            encodedGroup |= category
        }
        return encodedGroup
    }

    // Constructs collision filter options object
    public collisionFilter(): any {
        const collisionFilter: any = { }
        if (this.interactionCategories.length < 2) {
            collisionFilter.category = this.interactionCategories[this.interactionCategories.length - 1]
        } else {
            collisionFilter.mask = this.encodeGroup()
        }
        return collisionFilter
    }
}