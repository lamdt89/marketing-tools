import { CampaignRenderer } from '../base/CampaignRenderer'

export class CampaignTagRenderer extends CampaignRenderer {
    wrapClass = 'JTravel-Tag'
    cssRule = {
        '.jtravel-tags-container': {
            display: 'flex',
            'flex-flow': 'row wrap',
            'align-items': 'start',
            padding: '1%'
        },
        '.jtravel-tags-txt': {
            'text-align': 'center',
            margin: 0,
            'font-weight': 'bold',
            padding: '8px',
            'border-radius': '4px',
            color: 'white'
        },
        '.jtravel-tags-href': {
            cursor: 'pointer',
            'margin-right': '2px'
        }
    }

    createLink(model) {
        const p = document.createElement('p')
        p.setAttribute('class', 'jtravel-tags-txt')
        p.innerText = model.text
        // style
        if (model.backgroundColor) {
            p.style.backgroundColor = model.backgroundColor
        }
        if (model.textColor) {
            p.style.color = model.textColor
        }
        // create link
        const a = document.createElement('a')
        a.setAttribute('href', model.link)
        a.setAttribute('class', 'jtravel-tags-href')
        if (model.isBlank) {
            a.setAttribute('target', '_blank')
        }
        a.appendChild(p)
        a.setAttribute('id', model._id)

        return a
    }

    /**
     *
     * @param model
     * @returns {HTMLElement}
     */
    populateContent(model) {
        const tagContainer = document.createElement('div')
        tagContainer.setAttribute('class', 'jtravel-tags-container')
        const a = this.createLink(model)
        tagContainer.appendChild(a)

        return tagContainer
    }

    registerEvent(model, contentHtml) {
        super.registerEvent(model, contentHtml)
    }
}
