class Expansion < ActiveRecord::Base
  has_many :cards

  def draft
    return false if booster.nil?

    card_pool = []
    i = 0
    until card_pool.length == booster.length
      random_card = cards.sample
      if random_card.rarity.downcase == booster[i]
        card_pool << random_card
        i += 1
      end
    end

    return card_pool
  end

  def booster
    super.split(", ") if super
  end
end
