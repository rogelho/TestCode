import {TypeFilter} from "../../enum/shared/type-filter.enum";
import {Option} from "./option";

export class Filter {

    id: number;
    name: string;
    type: TypeFilter;
    values: string[];
    options: Option[];
    mascara: string;
    apagarCaracteresMascara: boolean;

    constructor(id?: number,
                name?: string,
                type?: TypeFilter,
                values?: string[],
                options?: Option[],
                mascara?: string,
                apagarCaracteresMascara?: boolean) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.values = values;
        this.options = options;
        this.mascara = mascara;
        this.apagarCaracteresMascara = apagarCaracteresMascara
    }

    isSelect(): boolean {
        return this.type == TypeFilter.SELECT;
    }

    isBetween(): boolean {
        return this.type == TypeFilter.BETWEEN;
    }

    isLike(): boolean {
        return this.type == TypeFilter.LIKE;
    }

    isNon(): boolean {
        return this.type == TypeFilter.NON;
    }

    getLabelOptionByValue(): string {
        let option = this.options.find(o => o.value == this.values[0]);
        return option ? option.label : '';
    }
}
